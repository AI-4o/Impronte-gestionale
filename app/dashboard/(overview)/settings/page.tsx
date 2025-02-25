'use client';
import { useState } from "react";
import { UserConfig } from "@/app/appConfig";
export default function Settings() {
    const [count, setCount] = useState(UserConfig.getInstance().getCount());
    return (
        <div>
            <h1 className="mb-4 text-xl md:text-2xl">SETTINGS</h1>
            <div>
                <b>App Config</b>
                <p>Count: {count}</p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => {UserConfig.getInstance().incrementCount(); setCount(UserConfig.getInstance().getCount()); }}>Increment Count</button>
            </div>
        </div>
    );
}


