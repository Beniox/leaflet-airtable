import {
    initializeBlock,
    useGlobalConfig,
    Box,
    useSettingsButton,
} from '@airtable/blocks/ui';
import React, { useState } from 'react';
import 'leaflet/dist/leaflet.css'; // Import Leaflet's CSS for proper rendering
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'boxicons'
import Settings from "./settings";
import {GlobalConfigKeys} from "./settings";
import './style.css'
import Leaflet from "./leaflet";

function App() {
    const [isShowingSettings, setIsShowingSettings] = useState(false);

    useSettingsButton(function () {
        setIsShowingSettings(!isShowingSettings);
    });

    const globalConfig = useGlobalConfig();

    // Retrieve global config values
    const tableId = globalConfig.get(GlobalConfigKeys.TABLE_ID);
    const latitudeFieldId = globalConfig.get(GlobalConfigKeys.LATITUDE_FIELD);
    const longitudeFieldId = globalConfig.get(GlobalConfigKeys.LONGITUDE_FIELD);
    const nameFieldId = globalConfig.get(GlobalConfigKeys.NAME_FIELD);
    const colorFieldId = globalConfig.get(GlobalConfigKeys.COLOR_FIELD);
    const boxIconFieldId = globalConfig.get(GlobalConfigKeys.BOX_ICON_FIELD);
    const iconSizeFieldId = globalConfig.get(GlobalConfigKeys.ICON_SIZE_FIELD);

    if (!tableId || !latitudeFieldId || !longitudeFieldId || !nameFieldId || !colorFieldId || !boxIconFieldId || !iconSizeFieldId) {
        return <Settings/>
    }

    if (isShowingSettings) {
        return <Settings/>
    }
    return (
        <Box display="flex" flexDirection="column" height="100vh">
            <Leaflet/>
        </Box>
    );
}

initializeBlock(() => <App/>);