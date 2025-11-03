const mRedis = {
  set: jest.fn(),
  get: jest.fn(),
  quit: jest.fn(),
};

export default jest.fn(() => mRedis);
