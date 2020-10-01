import testHelper, { TestFlowsItem } from "node-red-node-test-helper";
import chirpstackDeviceManagementNode from "../nodes/chirpstack-device-management/chirpstack-device-management";
import { ChirpstackDeviceManagementNodeDef } from "../nodes/chirpstack-device-management/modules/types";

type FlowsItem = TestFlowsItem<ChirpstackDeviceManagementNodeDef>;
type Flows = Array<FlowsItem>;

describe("chirpstack-device-management node", () => {
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
        type: "chirpstack-device-management",
        name: "chirpstack-device-management",
      },
    ];
    testHelper.load(chirpstackDeviceManagementNode, flows, () => {
      const n1 = testHelper.getNode("n1");
      expect(n1).toBeTruthy();
      expect(n1.name).toEqual("chirpstack-device-management");
      done();
    });
  });
});
