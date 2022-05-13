/* eslint-disable react/jsx-one-expression-per-line */
import React, { useEffect, useState } from 'react';

import { io } from 'socket.io-client';

import { QRCodeSVG } from 'qrcode.react';

import { FieldArray, Formik } from 'formik';
import { Button, TextField } from '@/components';
import { MdAdd, MdClose } from 'react-icons/md';
import smartphoneFormatter from '@/utils/smartphoneFormatter';

interface IFormData {
  number: string;
  text: '';
  buttons: { name: string }[];
}

const Home: React.FC = () => {
  const [socket] = useState(io('wss://whatsapp-buttons.herokuapp.com'));

  const [qrCode, setQrCode] = useState('');
  const [status, setStatus] = useState<
    'none' | 'qrcode' | 'connecting' | 'connected' | 'sent'
  >('none');

  useEffect((): any => {
    socket.on('connect', () => {
      socket.emit('new');

      socket.once('id', (id: string) => {
        socket.emit('WAconnect', id);
      });

      socket.on('qr', (qr: string) => {
        setStatus('qrcode');
        setQrCode(qr);
      });

      socket.on('WAconnecting', () => setStatus('connecting'));
      socket.on('WAconnected', () => setStatus('connected'));
    });

    return () => socket.disconnect();
  }, [socket]);

  const sendMessage = async (data: IFormData) => {
    const formatted = {
      numbers: [`55${data.number.replace(/\D/g, '').replace('9', '')}`],
      text: data.text,
      footer: 'asdad',
      buttons: data.buttons.map(i => ({
        type: 3,
        text: i.name,
        data: i.name,
      })),
    };

    socket.emit(
      'WAsend',
      formatted.numbers,
      formatted.text,
      formatted.footer,
      formatted.buttons,
    );
    setStatus('sent');
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <main className="pt-16" style={{ maxWidth: 512 }}>
        <h1 className="text-4xl font-semibold text-accent-6 text-center">
          Crie o botão para o
          <span className="text-primary font-semibold"> WhatsApp</span>
        </h1>

        {qrCode && status === 'qrcode' && (
          <div className="flex w-full justify-center mt-6">
            <QRCodeSVG value={qrCode} />
          </div>
        )}

        {status === 'connecting' && (
          <p className="text-center mt-6">Carregando...</p>
        )}

        {status === 'connected' && (
          <Formik
            initialValues={{
              number: '',
              text: '',
              buttons: [{ name: 'Favoritos' }],
            }}
            onSubmit={sendMessage}
          >
            {({ submitForm, values }) => (
              <div className="mt-8">
                <TextField
                  name="number"
                  label="Enviar para o número"
                  placeholder="Número de quem vai receber"
                  containerClassName="w-full mb-2"
                  formatOnChangeText={smartphoneFormatter}
                  isRequired
                />
                <TextField
                  name="text"
                  label="Texto da mensagem"
                  containerClassName="w-full mb-6"
                  isRequired
                />
                <FieldArray
                  name="buttons"
                  render={helpers => (
                    <div>
                      {values.buttons.map((button, index) => (
                        <div
                          key={String(`id=${index}`)}
                          className="flex justify-between mb-4"
                        >
                          <TextField
                            name={`buttons[${index}].name`}
                            label={`Botão ${index + 1}`}
                            placeholder="Escreve o nome do botão"
                            containerClassName="w-full"
                            isRequired
                          />

                          <button
                            type="button"
                            className="p-2 self-end bg-red text-accent-0 rounded ml-2"
                            onClick={() => helpers.remove(index)}
                          >
                            <MdClose size={24} />
                          </button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => helpers.push({ name: '' })}
                      >
                        <MdAdd size={24} className="mr-4" />
                        {`  Adicionar Botão`}
                      </Button>
                    </div>
                  )}
                />

                <Button className="mt-8 w-full" onClick={submitForm}>
                  Pronto
                </Button>
              </div>
            )}
          </Formik>
        )}

        {status === 'sent' && (
          <p className="mt-6 text-center">
            Você não conseguira ver que enviou a mensagem, ela deve chegar no
            seu próprio número respondendo você
          </p>
        )}
      </main>
    </div>
  );
};

export default Home;
