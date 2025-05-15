import { FC } from "react";
import Template from "../../layouts/Template";

const Favourates: FC = () => {
  return (
    <Template>
      <div className='flex-1 bg-gradient-to-b from-primary to-black p-8 overflow-auto pb-28'>
        <h1>Favourates</h1>
      </div>
    </Template>
  );
};

export default Favourates;
