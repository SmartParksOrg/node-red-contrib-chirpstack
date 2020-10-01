import testHelper, { TestFlowsItem } from "node-red-node-test-helper";
import chirpstackUserManagementNode from "../nodes/chirpstack-user-management/chirpstack-user-management";
import { ChirpstackUserManagementNodeDef } from "../nodes/chirpstack-user-management/modules/types";

type FlowsItem = TestFlowsItem<ChirpstackUserManagementNodeDef>;
type Flows = Array<FlowsItem>;

describe("chirpstack-user-management node", () => {
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
        type: "chirpstack-user-management",
        name: "chirpstack-user-management",
      },
    ];
    testHelper.load(chirpstackUserManagementNode, flows, () => {
      const n1 = testHelper.getNode("n1");
      expect(n1).toBeTruthy();
      expect(n1.name).toEqual("chirpstack-user-management");
      done();
    });
  });
});
