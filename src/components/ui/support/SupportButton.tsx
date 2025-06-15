import { useState } from 'react';
import { FloatButton, Modal, Button, QRCode, message } from 'antd';
import { HeartOutlined } from '@ant-design/icons';

interface SupportButtonProps {
}

const SupportButton: React.FC<SupportButtonProps> = ({ }) => {
    const [open, setOpen] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();
    const chavePix = import.meta.env.VITE_CHAVE_PIX;
    const qrCodePix = import.meta.env.VITE_QRCODE_PIX;

    const copiarPix = async () => {
        try {
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(chavePix);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = chavePix;
                document.body.appendChild(textarea);
                textarea.select();
                document.execCommand('copy');
                document.body.removeChild(textarea);
            }
            messageApi.open({
                type: 'success',
                content: 'Chave PIX copiada com sucesso!',
            });
        } catch { }
    };

    return (
        <>
            {contextHolder}
            <FloatButton
                icon={<HeartOutlined />}
                tooltip={{
                    title: 'Apoie este projeto!',
                    placement: 'left',
                }}
                onClick={() => setOpen(true)}
                style={{
                    boxShadow: 'none',
                }}
            />

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={null}
                title="Apoie via PIX"
                centered
                style={{ textAlign: 'center' }}
            >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                    <QRCode value={qrCodePix} size={200} errorLevel={'L'} />
                </div>
                <Button type="primary" style={{ width: 200 }} block onClick={copiarPix}>
                    Copiar chave PIX
                </Button>
            </Modal>
        </>
    );
}

export default SupportButton;