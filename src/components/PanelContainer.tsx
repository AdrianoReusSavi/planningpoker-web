import Layout, { Content } from 'antd/es/layout/layout';
import React from 'react';

interface PanelContainerProps {
    children: React.ReactNode;
}

const PanelContainer: React.FC<PanelContainerProps> = ({ children }) => {
    return (
        <Layout
            style={{ background: '#ffffff' }}
        >
            <Content style={{ width: '100vw', height: '100vh' }}>
                <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    boxSizing: 'border-box',
                    overflow: 'hidden'
                }}>
                    {children}
                </div>
            </Content>
        </Layout>
    );
};

export default PanelContainer;