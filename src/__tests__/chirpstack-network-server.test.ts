import testHelper, { TestFlowsItem } from "node-red-node-test-helper";
import chirpstackNetworkServerNode from "../nodes/chirpstack-network-server/chirpstack-network-server";
import { ChirpstackNetworkServerNodeDef } from "../nodes/chirpstack-network-server/modules/types";

type FlowsItem = TestFlowsItem<ChirpstackNetworkServerNodeDef>;
type Flows = Array<FlowsItem>;

describe("chirpstack-network-server node", () => {
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
        type: "chirpstack-network-server",
        name: "chirpstack-network-server",
      },
    ];
    testHelper.load(chirpstackNetworkServerNode, flows, () => {
      const n1 = testHelper.getNode("n1");
      expect(n1).toBeTruthy();
      expect(n1.name).toEqual("chirpstack-network-server");
      done();
    });
  });
});
