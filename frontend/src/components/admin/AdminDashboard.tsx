import { Card, Col, Row, Statistic, Typography } from "antd";

const AdminDashboard = () => {
  return (
    <div>
      <Typography.Title level={3}>
        Dashboard
      </Typography.Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Total Users"
              value={24}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Products"
              value={48}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Orders"
              value={125}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="Revenue"
              value={12500}
              prefix="₹"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
