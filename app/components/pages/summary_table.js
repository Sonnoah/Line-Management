"use client";

export default function SummaryTable({ summary }) {
  return (
    <div className="overflow-x-auto rounded-box">
      <table className="table table-sm">
        <thead>
          <tr>
            <th className="text-center">Name</th>
            <th className="text-center">Work Day</th>
            <th className="text-center">Day Off</th>
            <th className="text-center">Late - No Time Offset (Min)</th>
            <th className="text-center">Total OT</th>
            <th className="text-center">Parivate Pay</th>
            <th className="text-center">Parivate No Pay</th>
            <th className="text-center">Annual</th>
            <th className="text-center">Sick</th>
          </tr>
        </thead>

        <tbody>
          {summary.map((u, i) => (
            <tr key={i}>
              <td>{u.name}</td>
              <td className="text-center">{u.workingDays}</td>
              <td className="text-center">{u.holidays}</td>
              <td className="text-center">{u.lateMinutes}</td>
              <td className="text-center">{u.otTotal}</td>
              <td className="text-center">{u.leaveWithPay}</td>
              <td className="text-center">{u.leaveNoPay}</td>
              <td className="text-center">{u.leaveAnnual}</td>
              <td className="text-center">{u.leaveSick}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
