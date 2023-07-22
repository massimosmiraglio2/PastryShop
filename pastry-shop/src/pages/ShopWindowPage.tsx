import { useEffect, useState } from 'react';

import PastryList from '../components/pastries/PastryList';
import { Sale } from '../utils/data_utils/data_utils';
import { useHttpClient } from '../utils/custom_hooks/http-hook';

const backend_url =
  process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function ShopWindowPage() {
  const [sales, setSales] = useState<Sale[]>([]);
  const { sendRequest } = useHttpClient();

  useEffect(() => {
    const get = async () => {
      let sales_data: Sale[] = [];
      try {
        const responseData = await sendRequest(`${backend_url}/api/sales`);
        sales_data = responseData.sales;
      } catch (err) {}

      // not salable pastries will be filtered out (based on data: more than 3 days)
      sales_data = sales_data.filter((sale) => {
        return sale.available;
      });

      setSales(sales_data);
    };

    get().catch(console.error);
  }, [sendRequest]);

  return (
    <div>
      <PastryList sales={sales} />
    </div>
  );
}

export default ShopWindowPage;
