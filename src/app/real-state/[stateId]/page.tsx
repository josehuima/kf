
type Props = {
    params: {
      stateId: string;
    };
  };

const RealStatePage = async ({params : { stateId} }: Props) => {
   
    return (
        <div>
            <h1>Real State Details for {}</h1>
            {/* Render your data here */}
           
        </div>
    );
};

export default RealStatePage;