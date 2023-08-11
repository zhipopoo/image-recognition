'use client'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
const config = {
    initialColorMode: 'dark',
    useSystemColorMode: true,
}

// 3. extend the theme
const theme = extendTheme({ config })

export function Providers({
    children
}: {
    children: React.ReactNode
}) {
    return (
        <CacheProvider>
            <ChakraProvider theme={theme}>
                {children}
            </ChakraProvider>
        </CacheProvider>
    )
}

// 2. Add your color mode config

// const { definePartsStyle, defineMultiStyleConfig } =
//     createMultiStyleConfigHelpers(inputAnatomy.keys)

// const baseStyle = definePartsStyle({
//     // define the part you're going to style
//     field: {
//         fontFamily: 'mono', // change the font family
//         background: 'white'
//     },
// })

// const inputTheme = defineMultiStyleConfig({ baseStyle })
// const theme = extendTheme({
//     components: { Input: inputTheme },
// })