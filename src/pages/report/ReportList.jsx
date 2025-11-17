import { useEffect, useState } from "react";
import { getUnresolvedReports } from "../../services/reportService";

const ReportList = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getUnresolvedReports();
        setReports(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchReports();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Báo cáo chưa giải quyết</h1>
      {reports.length === 0 && <p>Không có báo cáo nào</p>}
      <ul>
        {reports.map(r => (
          <li key={r.id} className="border p-2 mb-2">
            <p><strong>Người báo cáo:</strong> {r.reporterUsername}</p>
            <p><strong>Người bị báo cáo:</strong> {r.targetUsername}</p>
            <p><strong>Lý do:</strong> {r.reason}</p>
            <p><strong>Trạng thái:</strong> {r.resolved ? "Đã xử lý" : "Chưa xử lý"}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReportList;
