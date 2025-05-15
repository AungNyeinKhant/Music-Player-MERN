import { FC } from "react";
import Template from "../../layouts/Template";

const RecentlyPlays: FC = () => {
  return (
    <Template>
      <div className='flex-1 bg-gradient-to-b from-primary to-black p-8 overflow-auto pb-28'>
        <h1>Recently Played</h1>
      </div>
    </Template>
  );
};

export default RecentlyPlays;
