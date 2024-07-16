class AppConfigSingleton {
    private static instance: AppConfigSingleton;
    private _googleSheetSpreadsheetId: string;

    private constructor() {
        this._googleSheetSpreadsheetId = "";
    }

    public static getInstance(): AppConfigSingleton {
        if (!AppConfigSingleton.instance) {
            AppConfigSingleton.instance = new AppConfigSingleton();
        }
        return AppConfigSingleton.instance;
    }

    public getGoogleSheetSpreadsheetId(): string {
        return this._googleSheetSpreadsheetId;
    }

    public setGoogleSheetSpreadsheetId(id: string): void {
        this._googleSheetSpreadsheetId = id;
    }
}

export default AppConfigSingleton.getInstance();
