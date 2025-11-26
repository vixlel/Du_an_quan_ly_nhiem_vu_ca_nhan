import Calendar from '~/components/Calendar';

const Dashboard = () => {
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Chỉ cần thả Calendar vào, nó sẽ tự fill container */}
      <Calendar />
    </div>
  );
};

export default Dashboard;
