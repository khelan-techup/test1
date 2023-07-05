import * as React from 'react';

import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';




import { debounce } from '@mui/material/utils';
import axiosInstance from "./../../../common/axiosInstance";







export default function GoogleMaps({ selected, onChange }) {
    const [value, setValue] = React.useState(null);
    const [inputValue, setInputValue] = React.useState('');
    const [options, setOptions] = React.useState([]);
    const [loading, setLoading] = React.useState(false)
    // const loaded = React.useRef(true);
    const handleLinkOldAccessionId = (value) => {
        return new Promise(async (resolve) => {
            //   this.setState({ isAccLoading: true })
            setLoading(true)
            const apiroute = window.$APIPath;
            const url = apiroute + "/api/BE_PatientAccessionMapping/GetAllPaging";
            let data = JSON.stringify({
                isDeleted: true,
                searchString: value,
                id: 0,
                pageNo: 0,
                totalNo: 0,
            });
            axiosInstance
                .post(url, data, {
                    headers: {
                        "Content-Type": "application/json; charset=utf-8",
                    },
                })
                .then((result) => {

                    setLoading(false)
                    resolve(result.data.outdata)

                })
        })
    }


    const fetch = React.useMemo(
        () =>
            debounce(async (request, callback) => {

                let data = await handleLinkOldAccessionId(request.input)
                console.log({ request, data })
                callback(data)
            }, 400),
        [],
    );

    React.useEffect(() => {
        let active = true;



        if (inputValue === '') {
            setOptions(value ? [value] : []);
            return undefined;
        }

        fetch({ input: inputValue }, (results) => {
            if (active) {
                let newOptions = [];

                if (value) {
                    newOptions = [value];
                }

                if (results) {
                    newOptions = [...newOptions, ...results];
                }

                setOptions(newOptions);
            }
        });

        return () => {
            active = false;
        };
    }, [value, inputValue, fetch]);

    return (
        <Autocomplete
            className="custom-autocomplete"
            sx={{ width: 300 }}
            getOptionLabel={(option) =>
                typeof option === 'string' ? option : option.accessionNo
            }
            value={selected}
            filterOptions={(x) => x}
            options={options}
            // autoComplete
            includeInputInList
            filterSelectedOptions
            loading={loading}
            noOptionsText="no Options"
            onChange={(event, newValue) => {
                setOptions(newValue ? [newValue, ...options] : options);

                onChange(newValue?.accessionNo, newValue?.patientAccessionId);
                setValue(newValue?.accessionNo);

                // console.log({ newValue })
            }}
            onInputChange={(event, newInputValue) => {
                setInputValue(newInputValue);
            }}
            renderInput={(params) => (
                <TextField {...params} fullWidth />
            )}

            renderOption={(props, option) => (
                <li {...props} key={option.patientId}>
                    {option.accessionNo}
                </li>
            )}

        />
    );
}