import AnimatedTableRow from "../animations/AnimatedTableRow";

function Table({ columns, data }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white/80">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="px-4 py-3 font-medium">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {data.map((row, index) => (
              <AnimatedTableRow key={row._id || index}>
                {columns.map((column) => (
                  <td key={column.key} className="px-4 py-3">
                    {column.render ? column.render(row) : row[column.key]}
                  </td>
                ))}
              </AnimatedTableRow>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Table;
