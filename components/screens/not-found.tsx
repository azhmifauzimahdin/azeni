interface NotFoundProps {
  message: string;
}

const NotFound: React.FC<NotFoundProps> = ({ message }) => {
  console.log("message :", message);
  return (
    <div className="w-screen h-screen flex items-center justify-center">
      {message}
    </div>
  );
};

export default NotFound;
