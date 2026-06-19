import Utils from './Utils';

test('uuid', () => {
  const uuid = Utils.generate_uuidv4();
  expect(uuid.length).toEqual(36);
  expect(uuid).toEqual(uuid.toLowerCase());
});
