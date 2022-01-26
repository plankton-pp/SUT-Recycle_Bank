import React from 'react'
import Select from 'react-select';
import { Form } from 'react-bootstrap';

function InputSelect({ title, star, classLabel, placeholder, idName, selectValue, optionsList, handleChange,
    handleInvalid, invalid, classFormGroup, mode, disabled, classFormCon }) {
    return (
        <Form.Group className={classFormGroup}>
            {title && <Form.Label className={`${classLabel} mb-1`}>{title} <span className="text-danger">{star ? "*" : ""}</span></Form.Label>}
            <div className={classFormCon}>
                <Select
                    menuPlacement="auto"
                    placeholder={placeholder}
                    id={idName}
                    name={idName}
                    value={selectValue}
                    options={optionsList}
                    onChange={(value) => {
                        handleChange(value)
                        if (handleInvalid) {
                            handleInvalid()
                        }
                    }}
                    styles={
                        {
                            control: (styles, state) => ({
                                ...styles,
                                // fontSize: '14px',
                                // "&:hover": {
                                //     borderColor: '#D0D4DA',
                                // },
                                backgroundColor: disabled ? '#e9ecef' : '#fff',
                                borderColor: state.isFocused ? '#80bdff' : invalid ? '#dc3545' : '#ced4da',
                                boxShadow: state.isFocused ? '0 0 0 0.2rem rgba(0,123,255,.25)' : '',
                            }),
                            container: (styles, state) => ({
                                ...styles,
                                width: mode === "filter" ? "115%" : "100%",
                            })
                        }
                    }
                    theme={theme => ({
                        ...theme,
                        colors: {
                            ...theme.colors,
                            neutral50: '#969AA1',  // Placeholder color
                        },
                    })}
                    components={{
                        IndicatorSeparator: () => null
                    }}
                    isSearchable={disabled ? false : true}
                    isDisabled={disabled ? true : false}
                />
            </div>

            {invalid ? <div className="invalid-error">{invalid}</div> : ""}

            <style jsx="true" global="true">{`
                .css-107lb6w-singleValue {
                    color: #495057 !important;
                }
                .css-cixz0v-placeholder {
                    font-size: 14px !important;
                }
            `}</style>
        </Form.Group>
    )
}

export default InputSelect
