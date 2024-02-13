import { Card, CardBody, Tab, Tabs } from "@nextui-org/react";
import Layout from "./_layout";

export default function Guide() {
  return (
    <Layout padding={false}>
      <div className="flex flex-col p-8 max-w-sm align-middle">
        <Tabs aria-label="Steps">
          <Tab key={"user"} title="User Guide">
            <h1 className="text-xl font-bold">User Guide</h1>
          </Tab>
          <Tab key={"Admin"} title="Admin Guide">
            <h1 className="text-xl font-bold">Admin Guide</h1>
          </Tab>
        </Tabs>
      </div>
    </Layout>
  )
}