import {
    Box, FormField, TablePickerSynced, FieldPickerSynced, Switch, Input, Text, Button, Select
} from '@airtable/blocks/ui';
import {FieldType} from "@airtable/blocks/models";
import React, {useEffect, useState} from 'react';
import {useGlobalConfig, useBase} from '@airtable/blocks/ui';
import {ErrorBoundary} from "react-error-boundary";
import {ReactSortable} from "react-sortablejs";
import 'boxicons/css/boxicons.min.css';

// Global Config Keys
export const GlobalConfigKeys = {
    TABLE_ID: 'tableId',
    LATITUDE_FIELD: 'latitudeFieldId',
    LONGITUDE_FIELD: 'longitudeFieldId',
    NAME_FIELD: 'nameFieldId',
    COLOR_FIELD: 'colorFieldId',
    BOX_ICON_FIELD: 'boxIconFieldId',
    ICON_SIZE_FIELD: 'iconSizeFieldId',
    USE_CLUSTERING: 'useClustering',
    ALLOW_FULL_SCREEN: 'allowFullScreen',
    SINGLE_ICON_NAME: 'singleIconName', // New key for single icon value
    USE_SINGLE_ICON: 'useSingleIcon',  // New key for toggle stat
    SINGLE_ICON_SIZE: 'singleIconSize',  // New key for single icon size
    USE_SINGLE_ICON_SIZE: 'useSingleIconSize',  // New key for icon size toggle
    SINGLE_COLOR: 'singleColor',  // New key for single color value
    USE_SINGLE_COLOR: 'useSingleColor',  // New key for color toggle
    LEGEND: 'legend',
    SHOW_LEGEND: 'showLegend',
    LEGEND_POSITION: 'legendPosition',
    GESTUREHANDLING: 'gestureHandling',
};

function Settings() {
    const base = useBase();
    const globalConfig = useGlobalConfig();
    const tableId = globalConfig.get(GlobalConfigKeys.TABLE_ID);
    const table = tableId ? base.getTableByIdIfExists(tableId) : null;

    // Helper function to validate the field selection
    const validateFieldSelection = (fieldKey, fieldLabel) => {
        const selectedField = globalConfig.get(fieldKey);
        if (!selectedField) {
            return <p style={{color: 'red'}}>{`${fieldLabel} is required`}</p>;
        }
        return null;
    };

    // check for permissions
    const permission = globalConfig.checkPermissionsForSetPaths(Object.entries(GlobalConfigKeys));
    if (permission.hasPermission === false) {
        return (<>
            <Box padding={3}>
                <Text>You do not have permission to edit these settings</Text>
                <About/>
            </Box>
        </>);
    }


    return (<ErrorBoundary FallbackComponent={() => <Box padding={3}>Something went wrong!</Box>}>
        <Box padding={3}>
            <h1>Settings</h1>
            <details>
                <summary>Database config</summary>
                <Box marginTop={2}>
                    <FormField label="Table" description="Select the table containing your data">
                        <TablePickerSynced globalConfigKey={GlobalConfigKeys.TABLE_ID}/>
                    </FormField>

                    {table && (<>
                        <FormField
                            label="Latitude Field"
                            // description="Choose the field with latitude values for marker placement"
                        >
                            <FieldPickerSynced table={table} globalConfigKey={GlobalConfigKeys.LATITUDE_FIELD}
                                               allowedTypes={[FieldType.NUMBER, FieldType.FORMULA]}/>
                        </FormField>
                        {validateFieldSelection(GlobalConfigKeys.LATITUDE_FIELD, 'Latitude Field')}

                        <FormField
                            label="Longitude Field"
                            // description="Choose the field with longitude values for marker placement"
                        >
                            <FieldPickerSynced table={table} globalConfigKey={GlobalConfigKeys.LONGITUDE_FIELD}
                                               allowedTypes={[FieldType.NUMBER, FieldType.FORMULA]}/>
                        </FormField>
                        {validateFieldSelection(GlobalConfigKeys.LONGITUDE_FIELD, 'Longitude Field')}

                    </>)}

                    {!table && (<p style={{color: 'red'}}>
                        Please select a table to configure the settings.
                    </p>)}
                </Box>
            </details>

            <details>
                <summary>Marker config</summary>
                <Box marginTop={3}>
                    <FormField
                        label="Name Field"
                        // description="Select the field used to display names for the markers"
                    >
                        <FieldPickerSynced table={table} globalConfigKey={GlobalConfigKeys.NAME_FIELD}/>
                    </FormField>
                    {validateFieldSelection(GlobalConfigKeys.NAME_FIELD, 'Name Field')}

                    {/* Color Toggle */}
                    <FormField label="Marker Color">
                        <Switch
                            value={globalConfig.get(GlobalConfigKeys.USE_SINGLE_COLOR) || false}
                            onChange={(value) => globalConfig.setAsync(GlobalConfigKeys.USE_SINGLE_COLOR, value)}
                            label="Use a single color for all markers"
                            size="large"
                        />
                        {globalConfig.get(GlobalConfigKeys.USE_SINGLE_COLOR) ? (<FormField label="Single Color">
                            <input
                                value={globalConfig.get(GlobalConfigKeys.SINGLE_COLOR) || ''}
                                onChange={(e) => globalConfig.setAsync(GlobalConfigKeys.SINGLE_COLOR, e.target.value)}
                                placeholder="Enter a color value (e.g., #FF5733)"
                                type={'color'}
                            />
                        </FormField>) : (<>
                            <FormField label="Color Field">
                                <FieldPickerSynced
                                    table={table}
                                    globalConfigKey={GlobalConfigKeys.COLOR_FIELD}
                                    allowedTypes={[FieldType.SINGLE_SELECT, FieldType.SINGLE_LINE_TEXT, FieldType.FORMULA,]}
                                />
                            </FormField>
                            {validateFieldSelection(GlobalConfigKeys.COLOR_FIELD, 'Color Field')}
                        </>)}
                    </FormField>


                    {/* Icon Toggle */}
                    <FormField label="Marker Icon">
                        <Switch
                            value={globalConfig.get(GlobalConfigKeys.USE_SINGLE_ICON) || false}
                            onChange={(value) => globalConfig.setAsync(GlobalConfigKeys.USE_SINGLE_ICON, value)}
                            label="Use a single icon for all markers"
                            size="large"
                        />
                        {globalConfig.get(GlobalConfigKeys.USE_SINGLE_ICON) ? (// Input for single icon value
                            <FormField label="Single Icon Name">
                                <Input
                                    value={globalConfig.get(GlobalConfigKeys.SINGLE_ICON_NAME) || ''}
                                    onChange={(e) => globalConfig.setAsync(GlobalConfigKeys.SINGLE_ICON_NAME, e.target.value)}
                                    placeholder="Enter an icon name (e.g., bx-map)"
                                />
                            </FormField>) : (<>
                            {/* Field picker for icon names*/}
                            <FormField label="Icon Field">
                                <FieldPickerSynced
                                    table={table}
                                    globalConfigKey={GlobalConfigKeys.BOX_ICON_FIELD}
                                    allowedTypes={[FieldType.SINGLE_LINE_TEXT, FieldType.FORMULA]}
                                />
                            </FormField>
                            {validateFieldSelection(GlobalConfigKeys.BOX_ICON_FIELD, 'Icon Field')}
                        </>)}
                    </FormField>


                    <p>
                        Go to <a href="https://boxicons.com/" target="_blank"
                                 rel="noopener noreferrer">boxicons.com</a> to browse icon names.
                    </p>

                    {/* Icon Size Toggle */}
                    <FormField label="Marker Icon Size">
                        <Switch
                            value={globalConfig.get(GlobalConfigKeys.USE_SINGLE_ICON_SIZE) || false}
                            onChange={(value) => globalConfig.setAsync(GlobalConfigKeys.USE_SINGLE_ICON_SIZE, value)}
                            label="Use a single size for all markers"
                            size="large"
                        />
                        {globalConfig.get(GlobalConfigKeys.USE_SINGLE_ICON_SIZE) ? (
                            <FormField label="Single Icon Size">
                                <Input
                                    type="number"
                                    value={globalConfig.get(GlobalConfigKeys.SINGLE_ICON_SIZE) || ''}
                                    onChange={(e) => globalConfig.setAsync(GlobalConfigKeys.SINGLE_ICON_SIZE, e.target.value)}
                                    placeholder="Enter icon size (e.g., 20)"
                                />
                            </FormField>) : (<>
                            <FormField label="Icon Size Field">
                                <FieldPickerSynced
                                    table={table}
                                    globalConfigKey={GlobalConfigKeys.ICON_SIZE_FIELD}
                                    allowedTypes={[FieldType.NUMBER, FieldType.FORMULA]}
                                />
                            </FormField>
                            {validateFieldSelection(GlobalConfigKeys.ICON_SIZE_FIELD, 'Icon Size Field')}
                        </>)}
                    </FormField>
                </Box>
            </details>


            <details>
                <summary>Map config</summary>
                <Box marginTop={2}>
                    <Switch
                        value={globalConfig.get(GlobalConfigKeys.USE_CLUSTERING) || false}
                        onChange={(value) => globalConfig.setAsync(GlobalConfigKeys.USE_CLUSTERING, value)}
                        label="Use Clustering"
                        size="large"
                    />

                    <Switch
                        value={globalConfig.get(GlobalConfigKeys.ALLOW_FULL_SCREEN) || false}
                        onChange={(value) => globalConfig.setAsync(GlobalConfigKeys.ALLOW_FULL_SCREEN, value)}
                        label="Allow Fullscreen"
                        size="large"
                    />

                    <Switch
                        value={globalConfig.get(GlobalConfigKeys.GESTUREHANDLING) || false}
                        onChange={(value) => globalConfig.setAsync(GlobalConfigKeys.GESTUREHANDLING, value)}
                        label="Zoom with ctrl + scroll"
                        size="large"
                    />


                </Box>
            </details>

            <details>
                <summary>Legend</summary>
                <Box marginTop={2}>
                    <Legend/>
                </Box>
            </details>


            <About/>
        </Box>
    </ErrorBoundary>);
}


const options = [
    {value: "bottomleft", label: "Bottom Left"},
    {value: "bottomright", label: "Bottom Right"},
    {value: "topleft", label: "Top Left"},
    {value: "topright", label: "Top Right"},
];

function Legend() {
    const globalConfig = useGlobalConfig();
    const legendJSON = globalConfig.get(GlobalConfigKeys.LEGEND) || '[]'
    let legend = "";
    try{
        legend = JSON.parse(legendJSON);
    } catch (e) {
        console.error(e);
    }
    // should have each an id, that is unique
    legend.map((item, index) => {
        item.id = index;
    });

    const [newMarker, setNewMarker] = useState({icon: "", color: "#000000", text: ""});
    const [error, setError] = useState("");


    const [items, setItems] = useState(legend || []);


    const saveToGlobalConfig = () => {
        const value = items.map((e) => {
            return {
                icon: e.icon,
                color: e.color,
                text: e.text
            }
        });
        const JSONValue = JSON.stringify(value)
        globalConfig.setAsync(GlobalConfigKeys.LEGEND, JSONValue)
    }

    useEffect(() => {
        saveToGlobalConfig()
    }, [items])


    // Function to delete a marker
    const deleteMarker = (id) => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
    };

    // Function to update a marker
    const updateMarker = (id, key, value) => {
        setItems((prevItems) =>
            prevItems.map((item) => (item.id === id ? {...item, [key]: value} : item))
        );
    };

    // Validation function
    const validateMarker = (marker) => {
        if (!marker.icon || !marker.text) {
            return "Icon and text are required.";
        }
        if (!/^#[0-9A-Fa-f]{6}$/i.test(marker.color)) {
            return "Please enter a valid hex color code (e.g., #FF5733).";
        }
        return "";
    };

    // Function to add a new marker with validation
    const addMarker = () => {
        const validationError = validateMarker(newMarker);
        if (validationError) {
            setError(validationError);
            return;
        }

        setItems((prevItems) => [
            ...prevItems,
            {id: Date.now(), ...newMarker},
        ]);
        setNewMarker({icon: "", color: "#000000", text: ""}); // Reset the form
        setError(""); // Reset error
    };

    return (
        <div>
            <h3>Legend</h3>

            <Switch
                value={globalConfig.get(GlobalConfigKeys.SHOW_LEGEND) || false}
                onChange={(value) => globalConfig.setAsync(GlobalConfigKeys.SHOW_LEGEND, value)}
                label="Enable legend"
                size="large"
            />

            <Text>
                Select the position where the legend will appear on the map.
            </Text>

            <Select
                options={options}
                value={globalConfig.get(GlobalConfigKeys.LEGEND_POSITION) || 'bottomleft'} // Default position
                onChange={(value) => globalConfig.setAsync(GlobalConfigKeys.LEGEND_POSITION, value)}
                width="320px"
            />

            <br/>

            <ReactSortable
                list={items}
                setList={setItems}
                handle=".handle"
                animation={150}
            >
                {items.map((item) => (
                    <div key={item.id} className="legend-item">
                        <span className="handle" style={{cursor: "grab", marginRight: 8}}>
                            <i className="bx bx-move"/>
                        </span>
                        <i
                            className={`bx bxs-${item.icon}`}
                            style={{
                                color: item.color,
                                fontSize: "20px",
                                marginRight: 8,
                            }}
                        />
                        <Input
                            type="text"
                            value={item.text}
                            onChange={(e) => updateMarker(item.id, "text", e.target.value)}
                            placeholder="Marker description"
                        />
                        <input
                            type="color"
                            value={item.color}
                            onChange={(e) => updateMarker(item.id, "color", e.target.value)}
                            style={{marginRight: 8}}
                        />
                        <Input
                            type="text"
                            value={item.icon}
                            onChange={(e) => updateMarker(item.id, "icon", e.target.value)}
                            placeholder="Icon Name (e.g., map)"
                            style={{marginRight: 8}}
                        />
                        <button
                            onClick={() => deleteMarker(item.id)}
                            style={{
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                color: "red",
                            }}
                        >
                            <i className="bx bx-trash"/>
                        </button>
                    </div>
                ))}
            </ReactSortable>

            <h4>Add New Marker</h4>
            <Box className="add-marker-form">
                <Input
                    type="text"
                    value={newMarker.text}
                    onChange={(e) => setNewMarker({...newMarker, text: e.target.value})}
                    placeholder="Marker Text"
                    style={{marginRight: 8}}
                    required={true}
                />
                <input
                    type="color"
                    value={newMarker.color}
                    onChange={(e) => setNewMarker({...newMarker, color: e.target.value})}
                    style={{marginRight: 8}}
                />
                <Input
                    type="text"
                    value={newMarker.icon}
                    onChange={(e) => setNewMarker({...newMarker, icon: e.target.value})}
                    placeholder="Icon Name (e.g., map)"
                    style={{marginRight: 8}}
                    required={true}
                />
                <Button onClick={addMarker} style={{cursor: "pointer"}}>
                    Add Marker
                </Button>

                {error && (
                    <Text style={{color: "red", marginTop: 8}}>
                        <strong>{error}</strong>
                    </Text>
                )}
            </Box>
        </div>
    );
}

function About() {
    return (<Box marginTop={3} className="about">
        <h2>About</h2>
        <p>
            Made by Benjamin Stieler.
            <br/>
            <br/>

            For more information, feature requests, or bug reports, please visit my <a
            href="https://github.com/Beniox/leaflet-airtable" target="_blank"
            rel="noopener noreferrer">GitHub</a>.

            <br/>
            <br/>

            <a href="https://boxicons.com/" target="_blank" rel="noopener noreferrer">
                BoxIcons
            </a>{' '}
            are used for icon rendering.
        </p>
    </Box>);
}

export default Settings;
