export class Queue {
  add = jest.fn().mockResolvedValue(true);
  getJob = jest.fn().mockResolvedValue(null);
  close = jest.fn().mockResolvedValue(true);
}
