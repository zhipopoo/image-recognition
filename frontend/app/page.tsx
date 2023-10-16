'use client'
// import Image from 'next/image'
import Search from '@/components/Search';
import {
  Drawer, DrawerBody,
  DrawerCloseButton,
  DrawerContent, DrawerHeader,
  DrawerOverlay,
  Heading,
  Image,
  Table,
  TableContainer, Tr, Td, Th, Thead, Tbody,
  Skeleton,
  useDisclosure, Stack
} from '@chakra-ui/react';
import { useEffect, useState, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';

const toDataURL = (url: string) => fetch(url)
  .then(response => response.blob())
  .then(blob => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => resolve(reader.result ?? '')
    reader.onerror = reject
    reader.readAsDataURL(blob)
  }))
export default function Home() {
  const [file, setFile] = useState<File | string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'upload' | 'view' | null>(null)
  const [query, setQuery] = useState<string>('')
  // const query=useRef('')
  const [isImagesLoading, setIsImagesLoading] = useState(false)
  const [result, setResult] = useState<{ [key: string]: number } | null>(null)
  const [uid, setUid] = useState<string>('')
  const [images, setImages] = useState<Array<{ img: string, tags: Array<{ tag: string, probability: number }>, }>>([])
  const { isOpen, onOpen, onClose } = useDisclosure()

  const submitHandling = async (fileData: File) => {
    setIsLoading(true)
    setFile(fileData)
    if (fileData) {
      const base64 = await toDataURL(URL.createObjectURL(fileData))
      let formData = new FormData()
      formData.append('img', base64 as string)
 
      fetch(`/recognition`, {
        method: 'POST', body: formData,  mode: 'no-cors'
      }).then(res => res.json()).then((result) => {
        setResult(result.data.reduce((prev: { [key: string]: number }, next:{ tag: string, probability: number }) => {
          prev[next.tag] = next.probability
          return prev
        }, {}))
        setIsLoading(false)
        onOpen()
        setMode('upload')

      }).finally(() => {
        setIsLoading(false)
        setTimeout(() => {
          loadImages().finally(() => {

            setIsImagesLoading(false)
          })
        }, 500)
      })
    }
  }

  // useEffect(() => {
  //   const userId = localStorage.getItem('uid')
  //   if (userId) {
  //     setUid(userId)
  //   } else {
  //     const newUserId = uuidv4()
  //     setUid(newUserId)
  //     localStorage.setItem('uid', newUserId)
  //   }
  // }, [])

  const loadImages = async (query?: string) => {
    setIsImagesLoading(true)
    return fetch(`/images${!query ? '' : '?search=' + query}`, { mode: 'no-cors'}).then(res => res.json()).then((result) => {
      setImages(result.data)
    })
  }
  useEffect(() => {
    setImages([]);
    loadImages(query).finally(() => {
      setTimeout(() => {

        setIsImagesLoading(false)
      }, 1000)
    })

  }, [query])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">

      <Search onSubmit={submitHandling} isLoading={isLoading} onSearch={(queryString) => setQuery(queryString)} />
      <Heading className='self-start' as='h2' size={'lg'} mt={4}>Recent Photos</Heading>
      <Stack direction={['row']} mt={6} spacing={4} justifyContent={'flex-start'} width={'100%'} flexWrap={'wrap'}>
        {isImagesLoading ?
          Array.from({ length: images?.length??5 }).map((i, index) =>
            <Skeleton key={index} aspectRatio={1} maxWidth={'200px'} width={200} minWidth={'100px'} isLoaded={isImagesLoading} />
          ) : images.map(item =>

            <Image key={item.img} boxSize='200px' src={item.img} alt='' objectFit={'contain'} onClick={() => {
            setFile(item.img)
              setResult(item.tags.reduce((prev: { [key: string]: number }, next) => {
                prev[next.tag] = next.probability
                return prev
              }, {}))
            onOpen()
            setMode('view')
            }} />
          )
        }
      </Stack>
      <Drawer placement={'right'} size={mode === 'upload' ? 'full' : 'lg'} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent background={'black'}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth='1px' borderBottomColor={'gray.50'} >Result</DrawerHeader>

          <DrawerBody>
            {file && <Image src={typeof file === 'string' ? file : URL.createObjectURL(file)} width='400' height='200' alt="" />}
            {result &&
              <div className='flex w-100 gap-2 my-5 flex-wrap'>
                {Object.keys(result).map(item =>
                  <span className='bg-[#eaeaea] text-black rounded-3xl py-2 px-4' key={result[item]}>
                    {item}
                  </span>
                )}
              </div>
            }
            {result &&
              <TableContainer >

                <Table variant='simple' color={'white'}>
                  <Thead background={'Highlight'}><Th>Object</Th>
                    <Th>Possibility</Th>
                  </Thead>
                  <Tbody background={'black'} color={'white'}>

                  {Object.keys(result).map(item =>
                    <Tr key={result[item]}>
                      <Td className='border border-slate-600 p-2'>{item}</Td>
                      <Td className='border border-slate-600 p-2'>{result[item]}%</Td>
                    </Tr>

                    )}
                  </Tbody>
                </Table>
              </TableContainer>

            }
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      {/* <form onSubmit={submitHandling}>
        <button type='submit'>Submit</button>
        {file && <Image src={URL.createObjectURL(file)} width='400' height='200' alt="" />}
      </form>
      {result &&
        <div className='flex w-100 gap-2 my-5'>

          {Object.keys(result).map(item =>
            <span className='bg-[#eaeaea] text-black rounded-3xl py-2 px-4' key={result[item]}>

              {item}
            </span>

          )}
        </div>

      }
      {result &&
        <table className='border-separate border-spacing-2 border'>
          <thead><th>Object</th>
            <th>Possibility</th>
          </thead>
          <tbody>

            {Object.keys(result).map(item =>
              <tr key={result[item]}>
                <td className='border border-slate-600 p-2'>{item}</td>
                <td className='border border-slate-600 p-2'>{result[item]}%</td>
              </tr>

            )}
          </tbody>
        </table>

      } */}

    </main>
  )
}
