import axios from "axios";
import { NodeData } from "@/lib/interfaces/graphTypes";

const fetchNodeDetails = async (nodeId: string): Promise<NodeData> => {
  const response = await axios.get(`/api/nodes/${nodeId}`);
  return response.data;
};

const fetchOwnerDetails = async (
  ownerId: string,
): Promise<{ username: string }> => {
  const response = await axios.get(`/api/profiles/${ownerId}/`);
  return { username: response.data.owner };
};

const fetchFullNodeDetails = async (
  nodeId: string,
): Promise<{ node: NodeData; owner: { username: string } }> => {
  const node = await fetchNodeDetails(nodeId);
  const owner = node.owner
    ? await fetchOwnerDetails(node.owner)
    : { username: "Unknown" };
  return { node, owner };
};

const updateNode = async (
  nodeId: string,
  data: Partial<NodeData>,
): Promise<NodeData> => {
  const response = await axios.put(`/api/nodes/${nodeId}/`, data);
  return response.data;
};

const deleteNode = async (nodeId: string): Promise<void> => {
  await axios.delete(`/api/nodes/${nodeId}/`);
};

export {
  fetchNodeDetails,
  fetchOwnerDetails,
  fetchFullNodeDetails,
  updateNode,
  deleteNode,
};
