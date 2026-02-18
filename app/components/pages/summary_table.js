"use client";

export default function SummaryTable({ summary }) {
  return (
    <div className="overflow-x-auto rounded-box">
      <table className="table table-sm">
        <thead>
          <tr>
            <th className="text-center">Name</th>
            <th className="text-center">Work Day (day)</th>
            <th className="text-center">Day Off (day)</th>
            <th className="text-center">Net Late (min)</th>
            <th className="text-center">OT x 1 (hr)</th>
            <th className="text-center">OT x 2 (hr)</th>
            <th className="text-center">Parivate Pay</th>
            <th className="text-center">Parivate No Pay</th>
            <th className="text-center">Annual</th>
            <th className="text-center">Sick</th>
          </tr>
        </thead>

        <tbody>
          {summary.map((u, i) => (
            <tr key={i}>
              <td className="text-[14px]">{u.name}</td>
              <td className="text-center text-[14px] align-middle">
                <span className="badge badge-soft badge-primary rounded-full border-0 w-20">
                  {u.workingDays}
                </span>
              </td>
              <td className="text-center text-[14px] align-middle">
                <span className="badge badge-soft badge-secondary rounded-full border-0  w-20">
                  {u.holidays}
                </span>
              </td>
              <td className="text-center text-[14px] align-middle">
                <span className="badge badge-soft badge-warning rounded-full border-0  w-20">
                  {u.lateMinutes} 
                </span>
              </td>
              <td className="text-center text-[14px] align-middle">
                <span className="badge badge-soft badge-success rounded-full border-0  w-20">
                  {u.otTotal}
                </span>
              </td>
              <td className="text-center text-[14px] align-middle">
                <span className="badge badge-soft badge-accent rounded-full border-0  w-20">
                  {u.otTotalx2}
                </span>
              </td>
              <td className="text-center text-[14px] align-middle">
                <span className="badge badge-soft badge-info rounded-full border-0  w-20">
                  {u.leaveWithPay}
                </span>
              </td>
              <td className="text-center text-[14px] align-middle">
                <span className="badge badge-soft badge-error rounded-full border-0  w-20">
                  {u.leaveNoPay}
                </span>
              </td>
              <td className="text-center text-[14px] align-middle">
                <span className="badge badge-soft rounded-full border-0  w-20">
                  {u.leaveAnnual}
                </span>
              </td>
              <td className="text-center text-[14px] align-middle">
                <span className="badge badge-soft bg-orange-600/10 text-orange-600 border-0 rounded-full w-20">
                  {u.leaveSick}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
