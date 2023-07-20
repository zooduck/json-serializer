Object.defineProperty(global, 'crypto', {
  value: {
    randomUUID() {
      return 'ee6b2a9c-c25e-40a3-87f3-ffef98977b98';
    }
  },
  writable: true
});
