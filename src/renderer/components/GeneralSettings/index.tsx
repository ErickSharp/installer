import React, { useState } from 'react';
import store from '../../redux/store';
import Store from 'electron-store';
import { setupInstallPath } from 'renderer/actions/install-path.utils';
import {
    Container,
    PageTitle,
    SettingItemContent,
    SettingItemName,
    SettingsItem,
    SettingsItems,
    InfoContainer,
    InfoButton, ResetButton
} from './styles';
import { configureInitialInstallPath } from "renderer/settings";

const settings = new Store;

type AutoUpdateSettingsItemType = {
    autoInstall: boolean,
    setAutoInstall: CallableFunction,
};

// eslint-disable-next-line no-unused-vars
function InstallPathSettingItem(props: { path: string, setPath: (path: string) => void }): JSX.Element {
    async function handleClick() {
        const path = await setupInstallPath();

        if (path) {
            props.setPath(path);
        }
    }

    return (
        <SettingsItem>
            <SettingItemName>Install Directory</SettingItemName>
            <SettingItemContent onClick={handleClick}>{props.path}</SettingItemContent>
        </SettingsItem>
    );
}

const AutoUpdateSettingsItem = (props: AutoUpdateSettingsItemType) => {
    async function handleClick() {
        const newState = !props.autoInstall;

        props.setAutoInstall(newState);
        settings.set('mainSettings.autoUpdateMods', newState);
    }

    return (
        <SettingsItem>
            <SettingItemName>Auto Install Mod Updates</SettingItemName>
            <SettingItemContent onClick={handleClick}>{props.autoInstall ? 'On' : 'Off'}</SettingItemContent>
        </SettingsItem>
    );
};

function index(): JSX.Element {
    const [installPath, setInstallPath] = useState<string>(settings.get('mainSettings.msfsPackagePath') as string);
    const [autoInstall, setAutoInstall] = useState<boolean>(settings.get('mainSettings.autoUpdateMods') as boolean);

    const handleReset = async () => {
        settings.clear();
        setInstallPath(await configureInitialInstallPath());
        setAutoInstall(false);
    };

    return (
        <>
            <Container>
                <PageTitle>General Settings</PageTitle>
                <SettingsItems>
                    <InstallPathSettingItem path={installPath} setPath={setInstallPath} />
                    <AutoUpdateSettingsItem autoInstall={autoInstall} setAutoInstall={setAutoInstall} />
                </SettingsItems>
            </Container>
            <InfoContainer>
                <InfoButton onClick={showchangelog}>{settings.get('metaInfo.currentVersion')}</InfoButton>
                <ResetButton onClick={handleReset}>Reset settings to default</ResetButton>
            </InfoContainer>
        </>
    );
}

function showchangelog() {
    const showchangelog = true;
    store.dispatch({ type: 'CHANGELOG', payload: {
        showchangelog
    } });
}

export default index;
