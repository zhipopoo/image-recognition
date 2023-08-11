'use client'
import { AttachmentIcon, SearchIcon } from '@chakra-ui/icons';
import {
    Input, InputGroup, InputLeftElement, InputRightElement, Spinner,
    Text,
    VStack
} from '@chakra-ui/react';
import { useRef, useState } from 'react';


const Search = ({ onSubmit, isLoading, onChange }: { onSubmit: (file: File) => void, isLoading: boolean, onChange: (evt: React.ChangeEvent<HTMLInputElement>) => void }) => {
    const fileRef = useRef<HTMLInputElement | null>(null)
    const [query, setQuery] = useState<string>('')
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    return (
        <>
            <InputGroup >
                <InputLeftElement pointerEvents='none'>
                    <SearchIcon color='gray.300' />
                </InputLeftElement>
                <Input placeholder='Search Photo' value={query} onChange={(evt) => {
                    setQuery(evt.target.value)
                    if (timerRef.current) {
                        clearTimeout(timerRef.current)
                    }
                    timerRef.current = setTimeout(() => {
                        onChange(evt)
                    }, 100)
                }} />
                <InputRightElement onClick={() => {
                    fileRef.current?.click()
                    console.log(fileRef)
                }}>
                    <AttachmentIcon color='gray.500'  >
                    </AttachmentIcon>
                    <input type="file" name="image" accept='image/png,image/jpeg' ref={fileRef} hidden onChange={(evt) => {
                        if (evt.target.files && evt.target.files.length > 0) onSubmit(evt.target.files[0])
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