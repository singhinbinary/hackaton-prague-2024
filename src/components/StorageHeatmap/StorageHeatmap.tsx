import Image from 'next/image';
import WorkingCatGif from './working-cat.gif';

export default function StorageHeatmap() {
  return (
    <div>
      <Image src={WorkingCatGif} alt="Working Cat" className="my-5" />
      <p>wip...</p>
    </div>
  );
}
