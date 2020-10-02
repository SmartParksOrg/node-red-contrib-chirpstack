import testHelper, { TestFlowsItem } from "node-red-node-test-helper";
import chirpstackOrganizationManagementNode from "../nodes/chirpstack-organization-management/chirpstack-organization-management";
import { ChirpstackOrganizationManagementNodeDef } from "../nodes/chirpstack-organization-management/modules/types";

type FlowsItem = TestFlowsItem<ChirpstackOrganizationManagementNodeDef>;
type Flows = Array<FlowsItem>;

describe("chirpstack-organization-management node", () => {
  beforeEach((done) => {
    testHelper.startServer(done);
  });

  afterEach((done) => {
    testHelper.unload().then(() => {
      testHelper.stopServer(done);
    });
  });

  it("should be loaded", (done) => {
    const flows: Flows = [
      {
        id: "n1",
        type: "chirpstack-organization-management",
        name: "chirpstack-organization-management",
      },
    ];
    testHelper.load(chirpstackOrganizationManagementNode, flows, () => {
      const n1 = testHelper.getNode("n1");
      expect(n1).toBeTruthy();
      expect(n1.name).toEqual("chirpstack-organization-management");
      done();
    });
  });
});
