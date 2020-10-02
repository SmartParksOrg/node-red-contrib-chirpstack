import testHelper, { TestFlowsItem } from "node-red-node-test-helper";
import chirpstackGatewayManagementNode from "../nodes/chirpstack-gateway-management/chirpstack-gateway-management";
import { ChirpstackGatewayManagementNodeDef } from "../nodes/chirpstack-gateway-management/modules/types";

type FlowsItem = TestFlowsItem<ChirpstackGatewayManagementNodeDef>;
type Flows = Array<FlowsItem>;

describe("chirpstack-gateway-management node", () => {
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
        type: "chirpstack-gateway-management",
        name: "chirpstack-gateway-management",
      },
    ];
    testHelper.load(chirpstackGatewayManagementNode, flows, () => {
      const n1 = testHelper.getNode("n1");
      expect(n1).toBeTruthy();
      expect(n1.name).toEqual("chirpstack-gateway-management");
      done();
    });
  });
});
