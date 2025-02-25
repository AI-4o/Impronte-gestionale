/** Singleton class to manage app configuration. --> using singleton pattern allows dependency injection.*/
export class UserConfig {
    private static instance: UserConfig;
    

    nomeOperatore = '';
    count = 0;
    private constructor() {} // Private constructor to enforce singleton
  
    static getInstance(): UserConfig {
      if (!UserConfig.instance) {
        UserConfig.instance = new UserConfig();
      }
      return UserConfig.instance;
    }

    setNomeOperatore(nome: string) {
        this.nomeOperatore = nome;
    }

    getNomeOperatore() {
        return this.nomeOperatore;
    }

    incrementCount() {
        this.count++;
    }

    getCount() {
        return this.count;
    }
  }