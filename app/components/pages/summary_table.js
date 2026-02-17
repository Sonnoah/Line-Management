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
            <th className="text-center">Total OT (hrs)</th>
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
                <span className="badge badge-soft badge-primary rounded-full w-20">
                  {u.workingDays}
                </span>
              </td>
              <td className="text-center text-[14px] align-middle">
                <span className="badge badge-soft badge-secondary rounded-full w-20">
                  {u.holidays}
                </span>
              </td>
              <td className="text-center text-[14px] align-middle">
                <span className="badge badge-soft badge-warning rounded-full w-20">
                  {u.lateMinutes} 
                </span>
              </td>
              <td className="text-center text-[14px] align-middle">
                <span className="badge badge-soft badge-accent rounded-full w-20">
                  {u.otTotal}
                </span>
              </td>
              <td className="text-center text-[14px] align-middle">
                <span className="badge badge-soft badge-info rounded-full w-20">
                  {u.leaveWithPay}
                </span>
              </td>
              <td className="text-center text-[14px] align-middle">
                <span className="badge badge-soft badge-error rounded-full w-20">
                  {u.leaveNoPay}
                </span>
              </td>
              <td className="text-center text-[14px] align-middle">
                <span className="badge badge-soft rounded-full w-20">
                  {u.leaveAnnual}
                </span>
              </td>
              <td className="text-center text-[14px] align-middle">
                <span className="badge badge-soft badge-success rounded-full w-20">
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
