'use client'
import { AttachmentIcon, SearchIcon } from '@chakra-ui/icons';
import {
    Input, InputGroup, InputLeftElement, InputRightElement, Spinner,
    Text,
    VStack
} from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { Component } from 'react';


const Search = ({ onSubmit, isLoading, value, onChange }: { onSubmit: (file: File) => void, isLoading: boolean, value: string, onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void }) => {
    const fileRef = useRef<HTMLInputElement | null>(null)

    return (
        <>
            <InputGroup>
                <InputLeftElement pointerEvents='none'>
                    <SearchIcon color='gray.300' />
                </InputLeftElement>
                <Input placeholder='Search Photo' value={value} onChange={onChange} />
                <InputRightElement onClick={() => {
                    fileRef.current?.click()
                    console.log(fileRef)
                }}>
                    <AttachmentIcon color='gray.500'  >
                    </AttachmentIcon>
                    <input type="file" name="image" ref={fileRef} hidden onChange={(evt) => {
                        if (evt.target.files && evt.target.files.length > 0) onSubmit(evt.target.files[0])
                        // setIsLoading(true)
                        // if (evt.target.files && evt.target.files.length > 0) {

                        //     setFile(evt.target.files[0])
                        //     submitHandling(evt.target.files[0])
                        // }
                    }} />
                </InputRightElement>
            </InputGroup>
            {isLoading &&
                <VStack
                    align={'center'}
                    mt={4}
                >

                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                    />
                    <Text as='b' mt={4} color='white'>Uploading</Text>
                </VStack>

            }
        </>

    )
}

export default Search