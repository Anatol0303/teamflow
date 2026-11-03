type PageContainerProps = {
    children: React.ReactNode;
};

function PageContainer({
                           children,
                       }: PageContainerProps) {
    return (
        <div className="container mt-4">
            {children}
        </div>
    );
}

export default PageContainer;