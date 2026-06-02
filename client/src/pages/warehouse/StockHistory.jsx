import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStockHistory } from "../../features/stock/stockSlice";
import EntityTablePage from "../shared/EntityTablePage";

function StockHistory() {
  const dispatch = useDispatch();
  const { history } = useSelector((state) => state.stock);

  useEffect(() => {
    dispatch(fetchStockHistory());
  }, [dispatch]);

  return (
    <EntityTablePage
      title="Stock Transfer History"
      columns={[
        { key: "type", label: "Type" },
        { key: "quantity", label: "Quantity" },
        { key: "product", label: "Product", render: (row) => row.product?.name || row.product },
        { key: "createdAt", label: "Date", render: (row) => new Date(row.createdAt).toLocaleString() },
      ]}
      data={history}
    />
  );
}

export default StockHistory;
