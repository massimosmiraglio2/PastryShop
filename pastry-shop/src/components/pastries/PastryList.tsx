import './PastryList.css';
import PastryItem from './PastryItem';
import { Sale } from '../../utils/data_utils/data_utils';

type Props = {
  sales: Sale[];
  onDelete?: (id: string) => void;
};

function PastryList({ sales, onDelete }: Props) {
  let html: JSX.Element[] = [];
  if (sales.length === 0) {
    html.push(
      <div className="pastrylist__empty" key="no_pastries">Non sono ancora presenti vendite</div>
    );
  } else {
    html = sales.map((sale, index) => {
      return <PastryItem key={sale.id} sale={sale} onDelete={onDelete} />;
    });
  }

  return <u className="pastrylist__container">{html}</u>;
}

export default PastryList;
