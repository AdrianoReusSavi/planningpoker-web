import Layout, { Content } from 'antd/es/layout/layout';
import React from 'react';

interface PanelContainerProps {
    children: React.ReactNode | [React.ReactNode, React.ReactNode];
}

const PanelContainer: React.FC<PanelContainerProps> = ({ children }) => {
    const containerClass = 'panel-container row';
    const leftClass = `panel-left desktop`;

    return (
        <Layout
            style={{
                width: '100vw',
                minHeight: '100vh',
                background: '#ffffff',
            }}
        >
            <Content style={{ height: '100vh' }}>
                <div className={containerClass}>
                    <div className={leftClass}>
                        {children}
                    </div>
                </div>
            </Content>
        </Layout>
    );
};

export default PanelContainer;