'use client'
import { AttachmentIcon, SearchIcon } from '@chakra-ui/icons';
import {
    Input, InputGroup, InputLeftElement, InputRightElement, Spinner,
    Text,
    VStack,Button
} from '@chakra-ui/react';
import { useRef, useState } from 'react';


const Search = ({ onSubmit, isLoading, onSearch }: { onSubmit: (file: File) => void, isLoading: boolean,onSearch:(query:string) =>void}) => {
    const fileRef = useRef<HTMLInputElement | null>(null)
    const [query, setQuery] = useState<string>('')
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    return (
        <>
                <form onSubmit={(evt)=>{
                    evt.preventDefault()
                    onSearch(query)
                }}>
            <InputGroup >
                <InputLeftElement pointerEvents='none'>
                    <SearchIcon color='gray.300' />
                </InputLeftElement>

                <Input placeholder='Search Photo' value={query} onChange={(evt) => {
                    setQuery(evt.target.value)
                }} />
                <InputRightElement>
                    <AttachmentIcon color='gray.500'   onClick={() => {
                        fileRef.current?.click()
                        console.log(fileRef)
                    }}>
                   
                    </AttachmentIcon>
                    <input type="file" name="image" accept='image/png,image/jpeg' ref={fileRef} hidden onChange={(evt) => {
                        if (evt.target.files && evt.target.files.length > 0) onSubmit(evt.target.files[0])
                    }} />
                </InputRightElement>
            </InputGroup>
                    </form>
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