/*
  Copyright (c) 2023-2024, Oracle and/or its affiliates.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

     https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

import { ConfigurationChangeEvent, ExtensionContext, workspace } from "vscode";
import { userConfigsListened } from "./configuration";
import { Disposable } from "vscode-languageclient";
import { globalState } from "../globalState";

const configChangeHandler = (params: ConfigurationChangeEvent) => {
    userConfigsListened.forEach((config: string) => {
        const doesAffect = params.affectsConfiguration(config);
        if (doesAffect) {
            globalState.getClientPromise().restartExtension(globalState.getNbProcessManager(), true);
        }
    });
}

const configChangeListener = workspace.onDidChangeConfiguration(configChangeHandler);


const listeners: Disposable[] = [configChangeListener];

export const registerConfigChangeListeners = (context: ExtensionContext) => {
    listeners.forEach((listener: Disposable)=>{
        context.subscriptions.push(listener);
    });
}