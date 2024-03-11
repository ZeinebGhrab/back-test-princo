import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(
        'mongodb+srv://zeinebghrab8:zeineb123@cluster0.mp1c4ad.mongodb.net/nest?retryWrites=true&w=majority',
      ),
  },
];
