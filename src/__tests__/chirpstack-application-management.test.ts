import testHelper, { TestFlowsItem } from "node-red-node-test-helper";
import chirpstackApplicationManagementNode from "../nodes/chirpstack-application-management/chirpstack-application-management";
import { ChirpstackApplicationManagementNodeDef } from "../nodes/chirpstack-application-management/modules/types";

type FlowsItem = TestFlowsItem<ChirpstackApplicationManagementNodeDef>;
type Flows = Array<FlowsItem>;

describe("chirpstack-application-management node", () => {
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
        type: "chirpstack-application-management",
        name: "chirpstack-application-management",
      },
    ];
    testHelper.load(chirpstackApplicationManagementNode, flows, () => {
      const n1 = testHelper.getNode("n1");
      expect(n1).toBeTruthy();
      expect(n1.name).toEqual("chirpstack-application-management");
      done();
    });
  });
});
