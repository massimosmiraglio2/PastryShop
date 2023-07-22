import { useContext, useEffect, useState } from 'react';

import PastryList from '../components/pastries/PastryList';
import { Sale } from '../utils/data_utils/data_utils';
import Button from '../components/form_element/Button';
import { useHttpClient } from '../utils/custom_hooks/http-hook';
import { AuthContext } from '../utils/context/authentication-context';

const backend_url =
  process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

function ManagementPage() {
  const auth = useContext(AuthContext);

  const [sales, setSales] = useState<Sale[]>([]);
  const { sendRequest } = useHttpClient();

  useEffect(() => {
    if (auth.isLoggedIn) {
      const get = async () => {
        let sales_data: Sale[] = [];
        try {
          const responseData = await sendRequest(`${backend_url}/api/sales`);
          sales_data = responseData.sales;
        } catch (err) {}

        setSales(sales_data);
      };

      get().catch(console.error);
    }
  }, [sendRequest, auth.isLoggedIn]);

  const onDeleteItem = async (id: string) => {
    try {
      const responseData = await sendRequest(
        `${backend_url}/api/sales/${id}`,
        'DELETE',
        null,
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );

      setSales(sales.filter((sale) => sale.id !== responseData.sale.id));
    } catch (err) {}
  };

  return (
    <div>
      <div style={{ textAlign: 'right' }}>
        <Button to="/sales/new">Crea vendita</Button>
      </div>
      <div>
        <PastryList sales={sales} onDelete={onDeleteItem} />
      </div>
    </div>
  );
}

export default ManagementPage;
