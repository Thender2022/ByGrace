export default function AdminOrders() {
    return (
      <div>
        <h1 className="text-2xl font-light tracking-[0.2em] uppercase mb-6">Orders</h1>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-light tracking-wider uppercase text-gray-500">Order ID</th>
                  <th className="text-left px-6 py-3 text-xs font-light tracking-wider uppercase text-gray-500">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-light tracking-wider uppercase text-gray-500">Amount</th>
                  <th className="text-left px-6 py-3 text-xs font-light tracking-wider uppercase text-gray-500">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-light tracking-wider uppercase text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-500 font-light">
                    No orders yet. Complete a test payment to see orders here.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }