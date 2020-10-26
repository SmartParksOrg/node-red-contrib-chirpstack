import testHelper, { TestFlowsItem } from "node-red-node-test-helper";
import chirpstackDeviceProfileManagementNode from "../nodes/chirpstack-device-profile-management/chirpstack-device-profile-management";
import { ChirpstackDeviceProfileManagementNodeDef } from "../nodes/chirpstack-device-profile-management/modules/types";

type FlowsItem = TestFlowsItem<ChirpstackDeviceProfileManagementNodeDef>;
type Flows = Array<FlowsItem>;

describe("chirpstack-device-profile-management node", () => {
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
        type: "chirpstack-device-profile-management",
        name: "chirpstack-device-profile-management",
      },
    ];
    testHelper.load(chirpstackDeviceProfileManagementNode, flows, () => {
      const n1 = testHelper.getNode("n1");
      expect(n1).toBeTruthy();
      expect(n1.name).toEqual("chirpstack-device-profile-management");
      done();
    });
  });
});
