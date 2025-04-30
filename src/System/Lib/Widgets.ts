import React, { createRef, RefObject, useCallback, useEffect, useRef, useState } from 'react'
import ReactDOM from 'react-dom'
import * as ReactDOMClient from 'react-dom/client'
import { Provider, useSelector } from 'react-redux'
import { RootState, store } from '../../store'
import * as mui from '@mui/material'
import notification from '../../assets/icon/notification.png'
import { configureStore, createSlice, SliceCaseReducers, ValidateSliceCaseReducers } from '@reduxjs/toolkit'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import dayjs from 'dayjs'
import ReactMarkdown from 'react-markdown'

export class Widgets {
  props: PropsWidget
  parent?: Widgets
  portalRef: RefObject<HTMLElement | null>
  parcel: { [key: string]: any } = {}
  theme: any

  constructor(props: PropsWidget) {
    this.props = props
    this.portalRef = createRef<HTMLElement>()
  }

  setupDimension() {
    switch (this.props.mode) {
      case 'center':
        switch (this.parent?.props.mode) {
          case 'rows':
          case 'column':
            this.props.width = this.props.width || 'unset'
            this.props.height = this.props.height || 'unset'
            break

          default:
            this.props.width = this.props.width || '100%'
            this.props.height = this.props.height || '100%'
            break
        }
        break

      case 'root':
        switch (this.parent?.props.mode) {
          case 'container':
            this.props.width = this.props.width || '100%'
            this.props.height = this.props.height || '100%'
            break

          default:
            this.props.width = this.props.width || '100%'
            this.props.height = this.props.height || '100vh'
            this.props.display = 'flex'
            break
        }
        break

      case 'click':
        switch (this.parent?.props.mode) {
          case 'container':
            this.props.width = this.props.width || '100%'
            this.props.height = this.props.height || '100%'
            break

          default:
            this.props.width = this.props.width || '100%'
            this.props.height = this.props.height || '100%'
            break
        }
        break

      case 'container':
        switch (this.parent?.props.mode) {
          case 'root':
            this.props.width = this.props.width || '100%'
            this.props.height = this.props.height || '100%'
            break

          case 'container':
            this.props.width = this.props.width || 'inherit'
            this.props.height = this.props.height || 'inherit'
            break

          case 'click':
          case 'stack':
          case 'positioned':
          case 'expanded':
          case 'root-portal':
            this.props.width = this.props.width || '100%'
            this.props.height = this.props.height || '100%'
            break

          case 'rows':
            this.props.width = this.props.width || 'unset'
            this.props.height = this.props.height || 'inherit'
            break

          case 'column':
            this.props.height = this.props.height || 'auto'
            this.props.width = this.props.width || '100%'
            break

          default:
            this.props.width = this.props.width || '100%'
            this.props.height = this.props.height || '100%'
            break
        }
        break

      case 'rows':
        switch (this.parent?.props.mode) {
          case 'singlechildscrollview':
            this.props.width = this.props.width || 'fit-content'
            this.props.height = this.props.height || '100%'
            break

          case 'container':
            this.props.width = this.props.width || '100%'
            this.props.height = this.props.height || '100%'
            break

          case 'column':
            this.props.flex = this.props.flex || 'unset'
            this.props.width = this.props.width || '100%'
            break

          default:
            this.props.flex = this.props.flex || '1'
            this.props.display = this.props.display || 'flex'
            this.props.flexDirection = this.props.flexDirection || 'row'
            this.props.width = this.props.width || '100%'
            this.props.height = this.props.height || '100%'
            break
        }
        break

      case 'TextField':
        this.props.width = this.props.width || '100%'
        this.props.height = this.props.height || '-webkit-fit-content'
        break

      case 'wrap':
      case 'stack':
      case 'column':
        this.props.boxSizing = 'border-box'
        switch (this.parent?.props.mode) {
          case 'singlechildscrollview':
            this.props.flex = this.props.flex || '1'
            this.props.height = this.props.height || 'fit-content'
            break

          case 'rows':
            this.props.width = this.props.width || 'auto'
            this.props.height = this.props.height || '100%'
            break

          default:
            this.props.flex = this.props.flex || '1'
            this.props.height = this.props.height || '100%'
            break
        }
        this.props.width = this.props.width || '100%'
        break

      case 'expanded':
        this.props.overflow = 'hidden'
        switch (this.parent?.props.mode) {
          case 'column':
            this.props.width = this.props.width || '100%'
            this.props.height = this.props.height || '100%'
            break

          default:
            break
        }
        break

      case 'space':
        switch (this.parent?.props.mode) {
          case 'column':
            this.props.height = this.props.length
            break

          case 'rows':
            this.props.width = this.props.length
            break

          default:
            break
        }
        break

      case 'singlechildscrollview':
        switch (this.parent?.props.mode) {
          default:
            this.props.width = this.props.width || '100%'
            this.props.height = this.props.height || '100%'
            break
        }
        break

      case 'input':
        this.props.padding = 5
        this.props.border = '0'
        this.props.outline = '0'
        this.props.color = 'white'
        switch (this.parent?.props.mode) {
          default:
            this.props.width = this.props.width || '-webkit-fill-available'
            this.props.height = this.props.height || '-webkit-fill-available'
            break
        }
        break

      default:
        break
    }
    return this
  }

  handleMouseDown = () => {}
  handleMouseUp = () => {}
  onMouseEnter() {}
  onMouseLeave() {}

  click() {
    this.handleMouseDown = () => {
      if (!this.portalRef.current) return
      this.portalRef.current.style.transform = 'scale(0.95)'
    }
    this.props.onMouseDown = this.handleMouseDown
    this.handleMouseUp = () => {
      if (!this.portalRef.current) return
      this.portalRef.current.style.transform = 'scale(1)'
      this.portalRef.current.style.boxShadow = 'unset'
    }
    this.props.onMouseUp = this.handleMouseUp
    return this
  }

  setKey(key: string) {
    this.props.key = key
  }

  portal: any
  builder(data?: { [key: string]: any }) {
    this.parcel = data || {}
    let child
    this.setupDimension()

    if (this.props.modal) {
      this.props.position = 'fixed'
      this.props.top = 0
      this.props.left = 0
      this.props.fullscreen = true
    }

    if (this.props.fullscreen) {
      this.props.width = '100%'
      this.props.height = '100vh'
    }

    if (this.props.mode === 'rows') {
      child = this.props.children
        ?.filter(x => x)
        .map((item, i) => {
          if (item instanceof Widgets) {
            item.parent = this
            if (this.props.theme) {
              item.props.theme = this.props.theme
              item.props = this.parseTheme(item.props, this.props.theme)
            }
            item.setKey(`rows-${i}`)
            return item.builder(data)
          } else {
            return React.createElement(React.Fragment, { key: `rows-${i}` }, item)
          }
        })
    }

    if (this.props.mode === 'column') {
      child = this.props.children
        ?.filter(x => x)
        .map((item, i) => {
          if (item instanceof Widgets) {
            item.parent = this
            if (this.props.theme) {
              item.props.theme = this.props.theme
              item.props = this.parseTheme(item.props, this.props.theme)
            }
            item.setKey(`column-${i}`)
            return item.builder(data)
          } else {
            return React.createElement(React.Fragment, { key: `column-${i}` }, item)
          }
        })
    }

    if (this.props.mode === 'text') {
      child = this.props.text
    }

    if (this.props.mode === 'FormControl') {
      child = this.props.children
        ?.filter(x => x)
        .map((item, i) => {
          if (item instanceof Widgets) {
            item.parent = this
            if (this.props.theme) {
              item.props.theme = this.props.theme
              item.props = this.parseTheme(item.props, this.props.theme)
            }
            item.setKey(`FormControl-${i}`)
            return item.builder(data)
          } else {
            return React.createElement(React.Fragment, { key: `FormControl-${i}` }, item)
          }
        })
    }

    if (this.props.mode === 'Select') {
      child = this.props.children
        ?.filter(x => x)
        .map((item, i) => {
          if (item instanceof Widgets) {
            item.parent = this
            if (this.props.theme) {
              item.props.theme = this.props.theme
              item.props = this.parseTheme(item.props, this.props.theme)
            }
            item.setKey(`Select-${i}`)
            return item.builder(data)
          } else {
            return React.createElement(React.Fragment, { key: `Select-${i}` }, item)
          }
        })
    }

    if (this.props.mode === 'ButtonGroup') {
      child = this.props.children
        ?.filter(x => x)
        .map((item, i) => {
          if (item instanceof Widgets) {
            item.parent = this
            if (this.props.theme) {
              item.props.theme = this.props.theme
              item.props = this.parseTheme(item.props, this.props.theme)
            }
            item.setKey(`ButtonGroup-${i}`)
            return item.builder(data)
          } else {
            return React.createElement(React.Fragment, { key: `ButtonGroup-${i}` }, item)
          }
        })
    }

    if (this.props.mode === 'Menu') {
      child = this.props.children
        ?.filter(x => x)
        .map((item, i) => {
          if (item instanceof Widgets) {
            item.parent = this
            if (this.props.theme) {
              item.props.theme = this.props.theme
              item.props = this.parseTheme(item.props, this.props.theme)
            }
            item.setKey(`Menu-${i}`)
            return item.builder(data)
          } else {
            return React.createElement(React.Fragment, { key: `Menu-${i}` }, item)
          }
        })
    }

    if (this.props.mode === 'wrap') {
      child = this.props.children
        ?.filter(x => x)
        .map((item, i) => {
          if (item instanceof Widgets) {
            item.parent = this
            if (this.props.theme) {
              item.props.theme = this.props.theme
              item.props = this.parseTheme(item.props, this.props.theme)
            }
            item.setKey(`wrap-${i}`)
            return item.builder(data)
          } else {
            return React.createElement(React.Fragment, { key: `wrap-${i}` }, item)
          }
        })
    }

    if (this.props.mode === 'stack') {
      child = this.props.children
        ?.filter(x => x)
        .map((item, i) => {
          if (item instanceof Widgets) {
            item.parent = this
            if (this.props.theme) {
              item.props.theme = this.props.theme
              item.props = this.parseTheme(item.props, this.props.theme)
            }
            item.setKey(`stack-${i}`)
            return item.builder(data)
          } else {
            return React.createElement(React.Fragment, { key: `stack-${i}` }, item)
          }
        })
    }

    if (this.props.mode === 'Tabs') {
      child = this.props.children
        ?.filter(x => x)
        .map((item, i) => {
          if (item instanceof Widgets) {
            item.parent = this
            if (this.props.theme) {
              item.props.theme = this.props.theme
              item.props = this.parseTheme(item.props, this.props.theme)
            }
            item.setKey(`Tabs-${i}`)
            return item.builder(data)
          } else {
            return React.createElement(React.Fragment, { key: `Tabs-${i}` }, item)
          }
        })
    }

    if (this.props.mode === 'icon' || this.props.mode === 'text') {
      if (this.props.size) {
        this.props.fontSize = this.props.size
      }
      if (this.props.color) {
        this.props.fontColor = this.props.color
        this.props.color = undefined
      }
    }

    if (this.props.center) {
      this.props.display = 'flex'
      this.props.flex = this.props.flex || '1'
      this.props.justifyContent = 'center'
      this.props.alignItems = 'center'
    }

    const styles = applyStyles({}, this.props)
    if (this.props.mode === 'click') {
      styles.transform = 'scale(1)'
      styles.transition = 'transform 200ms ease, box-shadow 200ms ease'
      styles.boxShadow = 'unset'
    }

    const configuration: any = {
      key: this.props.key!,
      ref: this.props.ref ? this.props.ref : this.portalRef,
      className: this.props.className || `widget-${this.props.mode!}`,
      style: styles,
      'data-mode': this.props.type!,
    }

    if (this.props.child) {
      if (this.props.child instanceof Function) {
        child = Widget(this.props.child)
      } else {
        if (this.props.child instanceof Widgets) {
          this.props.child = this.props.child as Widgets
          this.props.child.parent = this
          if (this.props.theme) {
            this.props.child.props.theme = this.props.theme
            this.props.child.props = this.parseTheme(this.props.child.props, this.props.theme)
          }
          child = React.createElement(React.Fragment, {}, this.props.child?.builder(data))
        } else {
          this.props.child = this.props.child as React.ReactNode
          child = React.createElement(React.Fragment, {}, this.props.child)
        }
      }
    }

    if (this.props.d) {
      configuration.d = this.props.d
    }
    if (this.props.fill) {
      configuration.fill = this.props.fill
    }
    if (this.props.stroke) {
      configuration.stroke = this.props.stroke
    }
    if (this.props.strokeWidth) {
      configuration.strokeWidth = this.props.strokeWidth
    }

    if (this.props.id) {
      configuration.id = this.props.id
    }

    const attributes = this.props.attr || {}
    for (const key in attributes) {
      configuration[key] = attributes[key]
    }

    if (this.props.onContextMenu) {
      // onContextMenu
      configuration.onContextMenu = (e: any) => {
        e.preventDefault()
        if (this.props.onContextMenu) {
          this.props.onContextMenu(e)
          return false
        }
      }
    }

    if (this.props.mode === 'input') {
      if (this.props.placeholder) {
        configuration.placeholder = this.props.placeholder
      }
    }

    if (this.props.src) {
      configuration.src = this.props.src
      configuration.draggable = false
    }

    if (this.props.mode === 'icon') {
      child = this.props.iconName
      configuration.className = `material-icons widget-${this.props.mode!}`
    }

    if (this.props.mode === 'click') {
      configuration.onClick = (e: any) => {
        e.stopPropagation()
        if (this.props.click) {
          this.props.click(e)
        }
      }
      this.click()
    }

    if (this.props.onClick) {
      configuration.onClick = (e: any) => {
        e.stopPropagation()
        if (this.props.onClick) {
          this.props.onClick(e)
        }
      }
    }

    if (this.props.onMouseDown) {
      configuration.onMouseDown = (e: any) => {
        e.stopPropagation()
        if (this.props.onMouseDown) {
          this.props.onMouseDown(e)
        }
      }
    }

    if (this.props.onMouseMove) {
      configuration.onMouseMove = (e: any) => {
        e.stopPropagation()
        if (this.props.onMouseMove) {
          this.props.onMouseMove(e)
        }
      }
    }

    if (this.props.onMouseUp) {
      configuration.onMouseUp = (e: any) => {
        e.stopPropagation()
        if (this.props.onMouseUp) {
          this.props.onMouseUp(e)
        }
      }
    }

    if (this.props.onMouseEnter) {
      configuration.onMouseEnter = (e: any) => {
        e.stopPropagation()
        if (this.props.onMouseEnter) {
          this.props.onMouseEnter(e)
        }
      }
    }

    if (this.props.onMouseLeave) {
      configuration.onMouseLeave = this.props.onMouseLeave
    }

    if (this.props.onScroll) {
      configuration.onScroll = this.props.onScroll
    }

    if (this.props.onFocus) {
      configuration.onFocus = this.props.onFocus
    }

    if (this.props.onKeyDown) {
      configuration.onKeyDown = this.props.onKeyDown
    }

    if (this.props.onKeyUp) {
      configuration.onKeyUp = this.props.onKeyUp
    }

    if (this.props.mode === 'root-portal') {
      const portalChild = React.createElement(
        this.props.type,
        { ...configuration, key: this.props.key || `portal-${Date.now()}` },
        child,
      )
      const helper = document.createElement('div')
      document.body.appendChild(helper)
      this.portal = ReactDOMClient.createRoot(helper)
      this.portal.render(
        ReactDOM.createPortal(
          React.createElement(Provider, {
            store,
            children: portalChild,
          }),
          helper,
          this.props.key || `portal-${Math.round(Math.random() * 1000000)}`,
        ),
      )

      this.portal.unMounting = () => {
        this.portal.unmount()
        try {
          document.body.removeChild(helper)
        } catch {
          console.log('Child has removed')
        }
      }
    } else {
      if (!configuration.key) {
        // configuration.key = useId();
      }

      if (typeof this.props.type === 'string') {
        this.portal = React.createElement(this.props.type!, configuration, child)
      } else {
        let defMui = Object.assign(configuration, this.props.mui)

        if (defMui.InputProps) {
          let startAdornment, endAdornment
          if (defMui.InputProps.startAdornment) {
            defMui.InputProps.startAdornment.parent = this
            defMui.InputProps.startAdornment.props.theme = this.props.theme
            startAdornment = defMui.InputProps.startAdornment.builder()
          }
          if (defMui.InputProps.endAdornment) {
            if (defMui.InputProps.endAdornment.parent) {
              defMui.InputProps.endAdornment.parent = this
              defMui.InputProps.endAdornment.props.theme = this.props.theme || {}
              endAdornment = defMui.InputProps.endAdornment.builder()
            }
          }
          delete defMui.InputProps
          defMui.InputProps = {
            startAdornment,
            endAdornment,
          }
        }

        if (defMui.style) {
          defMui.style = this.parseTheme(defMui.style, this.props.theme)
        }
        if (defMui.sx) {
          for (const key in defMui.sx) {
            defMui.sx[key] = this.parseThemeRecursive(defMui.sx[key], this.props.theme)
          }
        }

        if (this.props.sx) {
          defMui.sx = this.parseThemeRecursive(this.props.sx, this.props.theme)
        }

        if (defMui.markdown) {
          child = defMui.markdown
          defMui = {
            key: defMui.key,
            ref: defMui.ref,
          }
        }

        delete defMui.className
        this.portal = React.createElement(this.props.type!, defMui, child)
      }
    }

    return this.portal
  }

  react() {
    const Layout = () => this.builder()
    return Widget(Layout)
  }

  parseThemeRecursive(props: any, theme: any) {
    props = Object.entries(props).reduce(
      (acc, [key, value]) => {
        if (typeof value === 'string' && value.indexOf('theme.') >= 0) {
          acc[key] = this.parseThemeString(value, theme)
        } else {
          if (typeof value === 'object') {
            acc[key] = this.parseThemeRecursive(value, theme)
          } else {
            acc[key] = value
          }
        }
        return acc
      },
      {} as Record<string, any>,
    )

    return props
  }

  parseTheme(props: any, theme: any) {
    props = Object.entries(props).reduce(
      (acc, [key, value]) => {
        if (typeof value === 'string' && value.indexOf('theme.') >= 0) {
          acc[key] = this.parseThemeString(value, theme)
        } else {
          acc[key] = value
        }
        return acc
      },
      {} as Record<string, any>,
    )

    return props
  }

  parseThemeString(text: string, theme: any = {}) {
    return text.replace(/\btheme\.([a-zA-Z0-9_]+)\b/g, (match, key) => {
      return theme[key] || match
    })
  }

  PortalComponent({ type, configuration, children, key }: any) {
    useEffect(() => {
      const helper = document.createElement('div')
      document.body.appendChild(helper)
      const portal = ReactDOMClient.createRoot(helper)

      portal.render(React.createElement(type, { ...configuration, key: key || `portal-${Date.now()}` }, children))

      return () => {
        portal.unmount()
        try {
          document.body.removeChild(helper)
        } catch {
          console.log('Child has removed')
        }
      }
    }, [type, configuration, children, key])

    return null
  }

  buildPortal() {
    this.props.mode = 'root-portal'
    return this.builder()
  }

  getPanel() {
    return this.portal
  }
}

export function Modal(props: PropsWidget = {}) {
  const defaultConfig = props.child || Positioned(getDefaultConfig(props))

  const portal = Root({
    key: 'modal-root',
    modal: true,
    ...props,
    child: Stack({
      children: [
        Container({
          onClick: () => {
            cleanup()
          },
        }),
        defaultConfig,
      ],
    }),
  }).buildPortal()

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      cleanup()
    }
  }

  const cleanup = () => {
    portal?.unMounting()
    document.removeEventListener('keydown', handleEscape)
    if (props.onClose) {
      props.onClose()
    }
  }
  document.addEventListener('keydown', handleEscape)
  return portal
}

export function Snackbar(props: PropsWidget = {}) {
  const portal = Modal({
    theme: props.theme || {},
    child: Positioned({
      bottom: 20,
      right: 20,
      child: Container({
        width: 'unset',
        height: 'unset',
        color: 'black',
        radius: 5,
        padding: 20,
        maxWidth: 400,
        child:
          props.child ||
          Text(props.message, {
            color: 'white',
          }),
      }),
    }),
  })
  return portal
}

export function Confirm(props: PropsWidget = {}) {
  const width = 400
  const modal = Modal({
    backdropFilter: 'blur(5px)',
    theme: props.theme || {},
    child: Positioned({
      top: 30,
      left: (MediaQuery.width() - width) / 2,
      child: Container({
        radius: 5,
        width: width,
        height: props.height || 'unset',
        color: 'theme.backgroundPaper',
        shadow: true,
        child: Column({
          children: [
            Column({
              padding: 10,
              children: [
                props.title == '' ? Space(0) : Text(props.title || '', { weight: 'bold' }),
                Space(10),
                props.message == '' ? Space(0) : Text(props.message || '', {}),
              ],
            }),
            Space(20),
            Row({
              height: 40,
              children: [
                Expanded(),
                Button('Close', {
                  theme: props.theme,
                  backgroundColor: 'red',
                  fontColor: 'white',
                  icon: 'close',
                  onClick: () => {
                    modal.unMounting()
                  },
                }),
                Space(10),
                Button('Confirm', {
                  theme: props.theme,
                  backgroundColor: 'green',
                  fontColor: 'white',
                  icon: 'check',
                  onClick: () => {
                    modal.unMounting()
                    if (props.onAccept) {
                      props.onAccept()
                    }
                  },
                }),
                Space(10),
              ],
            }),
            Space(10),
          ],
        }),
      }),
    }),
  })

  return modal
}

export function Alert(props: PropsWidget = {}) {
  const portal = Modal({
    width: 300,
    height: 100,
    child: Container({
      color: 'white',
      radius: 10,
      shadow: true,
      padding: 10,
      child: Column({
        children: [
          Expanded({
            child: Row({
              children: [
                Container({
                  width: 50,
                  height: 50,
                  background: `url(${notification}) no-repeat center center`,
                  backgroundSize: 'cover',
                }),
                Space(10),
                Column({
                  children: [
                    Space(10),
                    Text(props.title || 'Alert', { fontWeight: 'bold', size: 14 }),
                    props.message ? Text(props.message, { size: 12 }) : SizedBox(),
                  ],
                }),
              ],
            }),
          }),
          Row({
            height: 35,
            children: [
              Expanded(),
              Button('OK', {
                paddingLeft: 20,
                paddingRight: 20,
                backgroundColor: 'green',
                width: 50,
                onClick: () => {
                  portal.unMounting()
                  if (props.onAccept) {
                    props.onAccept!()
                  }
                },
              }),
            ],
          }),
        ],
      }),
    }),
  })
}

export function Prompt(props: PropsWidget = {}) {
  let val = ''
  const Main = () => {
    const [value, setValue] = useState('')

    return TextField({
      label: props.ask,
      value,
      onChange: (e: any) => {
        val = e.target.value
        setValue(e.target.value)
      },
    }).builder()
  }
  const portal = Modal({
    width: 300,
    height: 130,
    child: Container({
      color: 'white',
      radius: 10,
      shadow: true,
      padding: 10,
      child: Column({
        children: [
          Expanded({
            child: Column({
              children: [Space(10), React.createElement(Main)],
            }),
          }),
          Row({
            height: 35,
            children: [
              Expanded(),
              Button('Cancel', {
                paddingLeft: 20,
                paddingRight: 20,
                backgroundColor: 'red',
                width: 50,
                onClick: () => {
                  portal.unMounting()
                },
              }),
              Space(10),
              Button('OK', {
                paddingLeft: 20,
                paddingRight: 20,
                backgroundColor: 'green',
                width: 50,
                onClick: () => {
                  portal.unMounting()
                  if (props.onAccept) {
                    props.onAccept!(val)
                  }
                },
              }),
            ],
          }),
        ],
      }),
    }),
  })
}

export function Svg(props: PropsWidget = {}) {
  props.mode = 'svg'
  props.type = 'svg'
  return new Widgets(props)
}

export function Path(props: PropsWidget = {}) {
  props.mode = 'path'
  props.type = 'path'
  props.xmlns = 'http://www.w3.org/2000/svg'
  return new Widgets(props)
}

export function Text(text: string, props: PropsWidget = {}) {
  props.fontColor = 'theme.textPrimary'
  if (props.textColor) {
    props.fontColor = props.textColor
    props.textColor = undefined
  }
  props.mode = 'text'
  props.type = 'span'
  props.text = text
  props.display = 'unset'
  return new Widgets(props)
}

export function Root(props: PropsWidget = {}) {
  props.mode = 'root'
  props.type = 'div'
  return new Widgets(props)
}

export function ButtonConfirm(text: string, { click, ...props }: PropsWidget = {}): any {
  const [confirm, setConfirm] = useState(false)
  if (!confirm) {
    return Container({
      child: Stack({
        children: [
          Button(text, {
            ...props,
            click: () => {
              setConfirm(true)
            },
          }),
          !props.loading
            ? null
            : Positioned({
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                child: Container({
                  color: '#00000082',
                  radius: 8,
                  child: Center({
                    child: CircularProgress({ fontColor: props.fontColor }),
                  }),
                }),
              }),
        ],
      }),
    })
  } else {
    return Button('Confirm', {
      ...props,
      icon: 'check',
      backgroundColor: 'green',
      fontColor: 'white',
      theme: props.theme,
      click: () => {
        if (click) {
          click()
        }
        setConfirm(false)
      },
    })
  }
}

export function Button(text: string, props: PropsWidget = {}): any {
  if (props.confirm) {
    if (props.onClick) {
      props.click = props.onClick
      props.onClick = undefined
    }
    return ButtonConfirm(text, {
      ...props,
      confirm: false,
      theme: props.theme,
    })
  }

  props.text = text
  props.paddingLeft = props.paddingLeft || 15
  props.paddingRight = props.paddingRight || 15
  props.fontSize = props.fontSize || '14px'
  props.borderRadius = props.borderRadius || '8px'
  props.border = props.border || 'none'
  props.cursor = props.cursor || 'pointer'
  props.transition = props.transition || 'all 0.3s ease'
  props.backgroundColor = props.backgroundColor || 'theme.primary'
  props.fontColor = props.fontColor || 'theme.textInverse'
  props.textColor = props.textColor || props.fontColor
  props.width = props.width || 'unset'
  props.userSelect = props.userSelect || 'none'

  props.child =
    props.child ||
    Center({
      child: props.icon
        ? Row({
            center: true,
            theme: props.theme,
            children: [
              IconMui(props.icon, { size: 20, fontColor: props.fontColor }),
              SizedBox({ width: props.text ? 10 : 0 }),
              Text(props.text, { size: 14, color: props.fontColor, userSelect: 'none' }),
            ],
          })
        : Text(props.text, { textColor: props.fontColor }),
    })

  if (props.loading) {
    props.loading = false
    return Container({
      child: Stack({
        children: [
          Button(text, {
            ...props,
          }),
          Positioned({
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            child: Container({
              color: '#00000082',
              radius: 8,
              child: Center({
                child: CircularProgress({ fontColor: props.fontColor }),
              }),
            }),
          }),
        ],
      }),
    })
  }

  if (props.disabled) {
    props.backgroundColor = 'theme.disabled'
    return Container(props)
  } else {
    return Click(props)
  }
}

export function Icon(name: any, props: PropsWidget = {}) {
  props.mode = 'icon'
  props.type = 'span'
  props.color = props.color || 'theme.textPrimary'
  props.iconName = name
  return new Widgets(props)
}

export function Image(props: PropsWidget = {}) {
  props.mode = 'image'
  props.type = 'img'
  props.width = props.width || '100%'
  props.height = props.height || 'auto'
  props.backgroundSize = props.backgroundSize || 'cover'
  return new Widgets(props)
}

export function Circle(props: PropsWidget = {}) {
  if (props.size) {
    props.width = props.size
    props.height = props.size
    props.radius = props.size as number
    delete props.size
  }
  return Container(props)
}

export enum EasingValue {
  linear = 'linear',
  easeInQuad = 'easeInQuad',
  easeOutQuad = 'easeOutQuad',
  easeInOutQuad = 'easeInOutQuad',
  easeInCubic = 'easeInCubic',
  easeOutCubic = 'easeOutCubic',
  easeInOutCubic = 'easeInOutCubic',
  easeInQuart = 'easeInQuart',
  easeOutQuart = 'easeOutQuart',
  easeInOutQuart = 'easeInOutQuart',
  easeInQuint = 'easeInQuint',
  easeOutQuint = 'easeOutQuint',
  easeInOutQuint = 'easeInOutQuint',
}

export const Easing: { [key: string]: (t: number) => number } = {
  linear: (t: number) => t,
  easeInQuad: (t: number) => t * t,
  easeOutQuad: (t: number) => t * (2 - t),
  easeInOutQuad: (t: number) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
  easeInCubic: (t: number) => t * t * t,
  easeOutCubic: (t: number) => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2),
  easeInQuart: (t: number) => t * t * t * t,
  easeOutQuart: (t: number) => 1 - Math.pow(1 - t, 4),
  easeInOutQuart: (t: number) => (t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2),
  easeInQuint: (t: number) => t * t * t * t * t,
  easeOutQuint: (t: number) => 1 - Math.pow(1 - t, 5),
  easeInOutQuint: (t: number) => (t < 0.5 ? 16 * t * t * t * t * t : 1 - Math.pow(-2 * t + 2, 5) / 2),
}

export function interpolateRange(value: number, input: [number, number], output: [number, number]): number {
  const [inputMin, inputMax] = input
  const [outputMin, outputMax] = output
  const clamped = Math.max(Math.min(value, inputMax), inputMin)
  const ratio = (clamped - inputMin) / (inputMax - inputMin)
  return outputMin + ratio * (outputMax - outputMin)
}
function animateValue(
  start: number,
  end: number,
  duration: number,
  ease: string,
  onUpdate: (value: number) => void,
  onended: Function,
) {
  const startTime = performance.now()
  function tick(currentTime: number) {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = Easing[ease] ? Easing[ease](progress) : Easing.easeOutCubic(progress)
    const currentValue = start + (end - start) * eased
    onUpdate(currentValue)
    if (progress < 1) {
      requestAnimationFrame(tick)
    } else {
      onended()
    }
  }
  requestAnimationFrame(tick)
}
export function Animated(props: PropsWidget & { builder: (value: number) => any; value: [number, number] }) {
  const [value, setValue] = useState(props.value[0])
  props.duration = props.duration || 1000
  props.easing = props.easing || 'easeOutQuad'
  const interpolate = (config: [number, number], builder: (value: number) => any) => {
    const mapped = interpolateRange(value, props.value, config)
    return builder(mapped)
  }
  if (props.ref.current) props.ref.current.interpolate = interpolate
  const onended = props.onEnd || function () {}

  useEffect(() => {
    props.ref.current = {
      start: () => {
        animateValue(props.value[0], props.value[1], props.duration!, props.easing!, setValue, onended)
      },
      reverse: () => {
        animateValue(props.value[1], props.value[0], props.duration!, props.easing!, setValue, onended)
      },
      interpolate: interpolate,
    }
  }, [props])

  return props.builder(value)
}

export function Draggable(props: PropsWidget = {}) {
  const boxRef = useRef<HTMLDivElement | null>(null)
  const [dragging, setDragging] = useState(false)
  const [position, setPosition] = useState(props.position || { x: 50, y: 50 })
  const offset = useRef({ x: 0, y: 0 })

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!boxRef.current) return

    setDragging(true)
    offset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!dragging) return
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight
    const boxWidth = boxRef.current?.offsetWidth || 0
    const boxHeight = boxRef.current?.offsetHeight || 0
    let newX = e.clientX - offset.current.x
    let newY = e.clientY - offset.current.y
    newX = Math.max(0, Math.min(windowWidth - boxWidth, newX))
    newY = Math.max(0, Math.min(windowHeight - boxHeight, newY))
    setPosition({ x: newX, y: newY })
  }

  const handleMouseUp = () => {
    setDragging(false)
  }

  props.left = position.x
  props.top = position.y

  props.ref = boxRef
  props.enable = props.enable != undefined ? props.enable : true
  if (props.enable) {
    props.onMouseDown = handleMouseDown
    props.onMouseMove = handleMouseMove
    props.onMouseUp = handleMouseUp
  }
  props.position = 'absolute'
  props.cursor = 'grab'
  props.userSelect = 'none'

  props.mode = 'drag'
  props.type = 'div'

  return new Widgets(props)
}

export function SingleChildScrollView(props: PropsWidget = {}) {
  props.mode = 'singlechildscrollview'
  props.type = 'div'
  props.flex = '1'
  props.overflow = props.overflow || 'auto'
  if (props.direction == 'vertical') {
    props.overflowY = props.overflow || 'auto'
  } else {
    props.overflowX = props.overflow || 'auto'
  }
  return new Widgets(props)
}

export function Row(props: PropsWidget = {}) {
  props.mode = 'rows'
  props.type = 'div'
  props.display = 'flex'
  props.flexDirection = 'row'
  return new Widgets(props)
}

/** @deprecated use Row instead */
export function Rows(props: PropsWidget = {}) {
  props.mode = 'rows'
  props.type = 'div'
  props.display = 'flex'
  props.flexDirection = 'row'
  return new Widgets(props)
}

export function Container(props: PropsWidget = {}) {
  props.mode = 'container'
  props.type = 'div'
  return new Widgets(props)
}

export function SizedBox(props: PropsWidget = {}) {
  props.mode = 'sizedBox'
  props.type = 'div'
  return new Widgets(props)
}

export function Click(props: PropsWidget = {}) {
  props.mode = 'click'
  props.type = 'div'
  props.cursor = 'pointer'
  return new Widgets(props)
}

export function Expanded(props: PropsWidget = {}) {
  props.mode = 'expanded'
  props.type = 'div'
  props.display = 'flex'
  props.flex = '1'
  return new Widgets(props)
}

export function Column(props: PropsWidget = {}) {
  props.mode = 'column'
  props.type = 'div'
  props.display = 'flex'
  props.flexDirection = 'column'
  return new Widgets(props)
}

export function Wrap(props: PropsWidget = {}) {
  props.mode = 'wrap'
  props.type = 'div'
  props.display = props.display || 'flex'
  props.flexWrap = 'wrap'
  props.alignContent = 'flex-start'
  return new Widgets(props)
}

export function Stack(props: PropsWidget = {}) {
  props.mode = 'stack'
  props.type = 'div'
  props.position = 'relative'
  return new Widgets(props)
}

export function Input(props: PropsWidget = {}) {
  props.mode = 'input'
  props.type = 'input'
  props.flex = 1
  props.paddingLeft = 10
  props.paddingRight = 10
  return new Widgets(props)
}

export function Center(props: PropsWidget = {}) {
  props.mode = 'center'
  props.type = 'div'
  props.display = 'flex'
  props.flex = '1'
  props.justifyContent = props.justifyContent || 'center'
  props.alignItems = 'center'
  return new Widgets(props)
}

export function Positioned(props: PropsWidget = {}) {
  props.mode = 'positioned'
  props.type = 'div'
  props.position = 'absolute'
  return new Widgets(props)
}

export function Widget(widget: any, props: any = {}, children?: any) {
  if (children) {
    return React.createElement(widget, props, children)
  } else {
    return React.createElement(widget, props)
  }
}

export function Markdown(props: PropsWidget = {}) {
  props.mode = 'ReactMarkdown'
  props.type = ReactMarkdown

  return new Widgets({
    ...props,
    mui: {
      markdown: props.markdown || '',
      components: props.components || {},
    },
  })
}

export function Space(length: any) {
  const l = typeof length === 'object' ? length.size : length
  const props: PropsWidget = {
    length: l,
    mode: 'space',
    type: 'div',
  }
  return new Widgets(props)
}

export function ButtonMui(props: PropsWidget = {}) {
  props.mode = 'ButtonMui'
  props.type = mui.Button
  return new Widgets(props)
}

export function Popup(e: any, props: PropsWidget = {}) {
  props.mode = 'Popover'
  props.type = mui.Popover
  props.mui = {
    anchorReference: props.anchorPosition ? 'anchorPosition' : undefined,
    anchorPosition: props.anchorPosition || { left: e.clientX + 2, top: e.clientY - 6 },
    anchorEl: e.currentTarget,
    open: true,
    anchorOrigin: props.anchorOrigin || {
      vertical: 'bottom',
      horizontal: 'left',
    },
    onClose: () => {
      cleanup()
    },
  }
  const element = new Widgets(props)

  const portal = Root({
    modal: false,
    child: element.builder(),
  }).buildPortal()

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      cleanup()
    }
  }

  const cleanup = () => {
    portal?.unMounting()
    document.removeEventListener('keydown', handleEscape)
    if (props.onClose) {
      props.onClose()
    }
  }
  document.addEventListener('keydown', handleEscape)
  return portal
}

export function Menu(e: any, props: PropsWidget = {}) {
  props.mode = 'Menu'
  props.type = mui.Menu
  props.mui = {
    anchorReference: props.anchorPosition ? 'anchorPosition' : undefined,
    anchorPosition: props.anchorPosition || { left: e.clientX + 2, top: e.clientY - 6 },
    anchorEl: e.currentTarget,
    open: true,
    onClose: () => {
      cleanup()
    },
  }
  const element = new Widgets(props)

  const portal = Root({
    modal: false,
    child: element.builder(),
  }).buildPortal()

  const handleEscape = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      cleanup()
    }
  }

  const cleanup = () => {
    portal?.unMounting()
    document.removeEventListener('keydown', handleEscape)
    if (props.onClose) {
      props.onClose()
    }
  }
  document.addEventListener('keydown', handleEscape)
  return portal
}

export function ListItemText(props: PropsWidget = {}) {
  props.mode = 'ListItemText'
  props.type = mui.ListItemText
  return new Widgets(props)
}

export function MenuItem(props: PropsWidget = {}) {
  props.mode = 'MenuItem'
  props.type = mui.MenuItem
  // props.inset = true as boolean
  return new Widgets({
    ...props,
    mui: {
      value: props.value || '',
    },
  })
}

export function ListItemIcon(props: PropsWidget = {}) {
  props.mode = 'ListItemIcon'
  props.type = mui.ListItemIcon
  return new Widgets(props)
}

export function Divider(props: PropsWidget = {}) {
  props.mode = 'Divider'
  props.type = mui.Divider
  return new Widgets({
    ...props,
    mui: {
      orientation: props.orientation || 'horizontal',
    },
  })
}

export function ButtonGroup(props: PropsWidget = {}) {
  props.mode = 'ButtonGroup'
  props.type = mui.ButtonGroup
  return new Widgets(props)
}

export function Checkbox(props: PropsWidget = {}) {
  props.mode = 'Checkbox'
  props.type = mui.Checkbox
  return new Widgets({
    mui: {
      checked: props.checked,
      disabled: props.disabled || false,
      indeterminate: props.indeterminate || false,
    },
    sx: {
      color: 'theme.textPrimary',
      '&.Mui-checked': {
        color: 'theme.primary',
      },
    },
    ...props,
  })
}

export function Fab(props: PropsWidget = {}) {
  props.mode = 'Fab'
  props.type = mui.Fab
  return new Widgets(props)
}

export function Tooltip(props: PropsWidget = {}) {
  props.mode = 'Tooltip'
  props.type = mui.Tooltip
  return new Widgets({
    ...props,
    mui: {
      title: props.title || '',
      placement: props.placement || 'bottom',
    },
  })
}

export function InputLabel(props: PropsWidget = {}) {
  props.mode = 'InputLabel'
  props.type = mui.InputLabel
  return new Widgets(props)
}

export function InputDate(props: PropsWidget = {}) {
  return Widget(LocalizationProvider, {
    dateAdapter: AdapterDayjs,
    children: [
      Widget(DatePicker, {
        key: props.key || 'date-1',
        format: 'YYYY-MM-DD',
        value: props.value,
        slotProps: {
          textField: {
            size: 'small',
            helperText: 'Masukkan tanggal sesuai format',
            sx: props.sx || {
              borderRadius: 5,
            },
          },
        },
        onChange: (e: any) => {
          if (props.onChange) {
            // const formatted = dayjs(e).format('YYYY-MM-DD');
            // console.log("Submit ke backend:", formatted);
            // props.onChange(formatted);
            props.onChange(dayjs(e))
          }
        },
      }),
    ],
  })
}

export function FormHelperText(props: PropsWidget = {}) {
  props.mode = 'FormHelperText'
  props.type = mui.FormHelperText
  return new Widgets({
    ...props,
  })
}

export function FormControl(props: PropsWidget = {}) {
  props.mode = 'FormControl'
  props.type = mui.FormControl
  return new Widgets({
    ...props,
    mui: {
      fullWidth: true,
    },
  })
}

export function Select(props: PropsWidget = {}) {
  props.mode = 'Select'
  props.type = mui.Select
  const select = new Widgets({
    ...props,
    mui: {
      value: props.value,
      onChange: props.onChange || (() => {}),
      MenuProps: props.MenuProps || {},
      size: 'small',
    },
  })

  return FormControl({
    ...props,
    children: [
      InputLabel({
        child: Text(props.label || ''),
      }),
      select,
      FormHelperText({
        child: Text(props.helperText || ''),
      }),
    ],
  })
}

export function Slider(props: PropsWidget = {}) {
  props.mode = 'Slider'
  props.type = mui.Slider
  return new Widgets({
    ...props,
    mui: {
      disabled: props.disabled || false,
      defaultValue: props.defaultValue || '',
      onChange: props.onChange || (() => {}),
      value: props.value || '',
    },
  })
}

export function FormControlLabel(props: PropsWidget = {}) {
  props.mode = 'FormControlLabel'
  props.type = mui.FormControlLabel
  return new Widgets({
    ...props,
    mui: {
      disabled: props.disabled || false,
      required: props.required || false,
      label: props.label || '',
      control: props.control || null,
      sx: {
        ...props.sx,
        '& .MuiFormControlLabel-label': {
          color: props.error ? 'red' : 'theme.textPrimary',
        },
        '& .MuiCheckbox-root': {
          color: props.error ? 'red' : 'theme.textPrimary',
        },
        '& .MuiCheckbox-root.Mui-checked': {
          color: props.error ? 'darkred' : 'theme.textPrimary',
        },
      },
    },
  })
}

export function Switch(props: PropsWidget = {}): any {
  props.mode = 'Switch'
  props.type = mui.Switch
  const widget = new Widgets({
    ...props,
    mui: {
      disabled: props.disabled || false,
      onChange: props.onChange || (() => {}),
      checked: props.checked || false,
      key: props.key || 'switch-key',
      sx: {
        '& .MuiSwitch-switchBase': {
          color: props.checked ? 'theme.primary' : 'theme.textDisabled',
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
          color: 'theme.primary',
        },
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
          backgroundColor: 'theme.primary',
        },
        '& .MuiSwitch-thumb': {
          backgroundColor: props.checked ? 'white' : 'theme.primary',
        },
        '& .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: '#ccc',
        },
      },
    },
  })

  if (props.label) {
    return FormControlLabel({
      control: widget.builder(),
      label: props.label,
      disabled: props.disabled || false,
      required: props.required || false,
    })
  } else {
    return widget
  }
}

export function CircularProgress(props: PropsWidget = {}) {
  props.mode = 'CircularProgress'
  props.type = mui.CircularProgress
  return new Widgets({
    ...props,
    mui: {
      color: props.color || 'primary',
      size: props.size || 24,
      sx: props.sx || {},
    },
  })
}

export function Paper(props: PropsWidget = {}) {
  props.mode = 'container'
  props.type = mui.Paper
  return new Widgets({
    ...props,
    mui: {
      component: props.component || 'div',
      animation: props.animation || 'wave',
      elevation: props.elevation || 1,
      style: {
        flex: 1,
        backgroundColor: 'theme.backgroundPaper',
        ...props,
      },
    },
  })
}

export function Autocomplete() {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<any>([])
  const [inputValue, setInputValue] = useState('')
  const loading = open && options.length === 0

  useEffect(() => {
    let active = true

    if (!loading) return
    ;(async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        const result = [
          { id: 1, name: 'Banana' },
          { id: 2, name: 'Banana Cake' },
          { id: 3, name: 'Banana Smoothie' },
        ].filter(item => item.name.toLowerCase().includes(inputValue.toLowerCase()))

        if (active) {
          setOptions(result)
        }
      } catch (e) {
        console.error(e)
      }
    })()

    return () => {
      active = false
    }
  }, [loading, inputValue])

  useEffect(() => {
    if (!open) {
      setOptions([])
    }
  }, [open])

  return Widget(mui.Autocomplete, {
    open,
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false),
    options,
    loading,
    onInputChange: (_e: any, txt: string) => setInputValue(txt),
    getOptionLabel: (option: any) => option.name || '',
    renderInput: (params: any) => {
      console.log('params', params)
      return TextField({
        ...params,
        size: 'small',
        placeholder: 'Cari sesuatu...',
        endIcon: Icon('home'),
      }).builder()
    },
  })
}

export function Tab(props: PropsWidget = {}) {
  props.mode = 'Tab'
  props.type = mui.Tab
  return new Widgets({
    ...props,
    mui: {
      label: props.label || '',
      sx: {
        color: 'theme.textPrimary',
      },
    },
  })
}

export function Tabs(props: PropsWidget = {}) {
  const { colors } = useSelector((state: RootState) => state.theme)
  const [value, setValue] = useState(props.value || 0)

  props.mode = 'Tabs'
  props.type = mui.Tabs
  const tabs = new Widgets({
    ...props,
    mui: {
      variant: props.variant || '',
      value: value,
      onChange:
        props.onChange ||
        ((_e: any, v: any) => {
          setValue(v)
        }),
      sx: {
        borderBottom: '1px solid',
        borderColor: 'divider',
        '& .MuiTabs-indicator': {
          height: 3,
          borderRadius: 2,
        },
        '& .MuiButtonBase-root': {
          color: colors.textPrimary,
        },
        '& .Mui-selected': {
          color: colors.primary,
        },
      },
    },
    children: props.tabs?.map(label => {
      return Tab({
        label,
      })
    }),
  })

  return Container({
    width: '100%',
    backgroundColor: colors.background,
    fontColor: colors.textPrimary,
    child: Column({
      children: [
        tabs,
        Expanded({
          child: Stack({
            children: props.contentTabs?.map((content, index) => {
              return Positioned({
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                display: value == index ? 'flex' : 'none',
                fontColor: colors.textPrimary,
                child: content,
              })
            }),
          }),
        }),
      ],
    }),
  }).builder()
}

export function Skeleton(props: PropsWidget = {}) {
  props.mode = 'Skeleton'
  props.type = mui.Skeleton
  return new Widgets({
    ...props,
    mui: {
      variant: props.variant || 'rectangular',
      animation: props.animation || 'wave',
    },
  })
}

export function Fragment(props: PropsWidget = {}) {
  props.mode = 'Fragment'
  props.type = React.Fragment
  return new Widgets(props)
}

export function InputAdornment(props: PropsWidget = {}) {
  props.mode = 'InputAdornment'
  props.type = mui.InputAdornment
  return new Widgets({
    ...props,
    mui: {
      position: props.position || 'start',
    },
  })
}

export function IconButton(name: any, props: PropsWidget = {}) {
  props.mode = 'IconButton'
  props.type = name
  return new Widgets({
    ...props,
    cursor: 'pointer',
    style: props.style || {
      color: 'red',
      cursor: 'pointer',
    },
    mui: {
      position: props.position || 'start',
      onClick: props.onClick || (() => {}),
      style: {
        color: props.color || 'theme.textPrimary',
        cursor: 'pointer',
      },
    },
  })
}

export function Badge(props: PropsWidget = {}) {
  props.mode = 'Badge'
  props.type = mui.Badge
  return new Widgets({
    ...props,
    sx: {
      badgeContent: props.badgeContent || '',
      color: props.color || 'theme.textPrimary',
      ...props.sx,
    },
  })
}

export function IconMui(name: any, props: PropsWidget = {}) {
  // return React.createElement(name, {
  props.mode = 'IconMui'
  props.type = name
  return new Widgets({
    ...props,
    sx: {
      color: props.fontColor || 'theme.textPrimary',
      fontSize: props.size || 24,
      cursor: 'pointer',
      ...props.sx,
    },
  })
}

export function IconComponent(name: any, props: PropsWidget = {}) {
  props.mode = 'IconComponent'
  props.type = name
  return new Widgets({
    ...props,
    cursor: 'pointer',
    style: props.style || {
      color: 'red',
      cursor: 'pointer',
    },
    mui: {
      position: props.position || 'start',
      onClick: props.onClick || (() => {}),
      style: {
        color: props.color || 'theme.textPrimary',
        cursor: 'pointer',
      },
    },
  })
}

export function TextField(props: PropsWidget = {}) {
  props.mode = 'TextField'
  props.type = mui.TextField
  const InputProps = props.InputProps || {}
  const inputProps = props.inputProps || {}
  if (props.endIcon) {
    props.endAdornment = props.endIcon
    props.endIcon = undefined
  }
  if (props.startIcon) {
    props.startAdornment = props.startIcon
    props.startIcon = undefined
  }
  if (props.endAdornment) {
    InputProps.endAdornment = InputAdornment({
      position: 'end',
      style: { cursor: 'pointer' },
      child: props.endAdornment,
    })
  }
  if (props.startAdornment) {
    InputProps.startAdornment = InputAdornment({
      position: 'start',
      style: { cursor: 'pointer' },
      child: props.startAdornment,
    })
  }
  if (props.minLength) {
    inputProps.minLength = props.minLength
  }
  if (props.maxLength) {
    inputProps.maxLength = props.maxLength
  }
  return new Widgets({
    ...props,
    mui: {
      type: props.obscureText ? 'password' : props.inputType || 'text',
      fullWidth: props.fullWidth || true,
      size: props.size || 'small',
      disabled: props.disabled || false,
      variant: props.variant || 'outlined',
      value: props.value,
      placeholder: props.placeholder || '',
      label: props.label || '',
      onChange: props.onChange || (() => {}),
      onBlur: props.onBlur || (() => {}),
      error: props.error || false,
      helperText: props.helperText || '',
      multiline: props.multiline || false,
      required: props.required || false,
      rows: props.rows || null,
      minRows: props.minRows || null,
      maxRows: props.maxRows || null,
      InputProps: InputProps,
      inputProps: inputProps,
      sx: {
        ...props.sx,
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: props.error ? 'red' : 'theme.textPrimary',
          },
          '&:hover fieldset': {
            borderColor: props.error ? 'orange' : 'theme.textPrimary',
          },
          '&.Mui-focused fieldset': {
            borderColor: props.error ? 'red' : 'theme.textPrimary',
          },
        },
        '& .MuiInputBase-input': {
          color: props.error ? 'red' : 'theme.textPrimary',
        },
        '& .MuiFormHelperText-root': {
          color: props.error ? 'red' : 'theme.textSecondary',
        },
        '& .MuiInputLabel-root': {
          color: props.error ? 'red' : 'theme.textSecondary',
        },
        '& .MuiInputLabel-shrink': {
          color: props.error ? 'red' : 'theme.textPrimary',
        },
      },
    },
  })
}

export function LayoutBuilder(props: PropsWidget = {}) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const element = ref.current
    if (!element) return

    // Set initial size
    const rect = element.getBoundingClientRect()
    setSize({ width: rect.width, height: rect.height })
    props.onResize?.({ width: rect.width, height: rect.height })

    const resizeObserver = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ width, height })
      props.onResize?.({ width, height })
    })

    resizeObserver.observe(element)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return Container({
    ref,
    child: props.builder!(size),
  })
}

const parseSafeInt = (value: any, defaultValue: number) => (isNaN(parseInt(value)) ? defaultValue : parseInt(value))

const throttle = (fn: any, wait: any) => {
  let lastTime = 0
  return (...args: any) => {
    const now = Date.now()
    if (now - lastTime >= wait) {
      fn(...args)
      lastTime = now
    }
  }
}

export function Resize(props: PropsWidget = {}) {
  const initialWidth = parseSafeInt(props.width, 0)
  const [width, setWidth] = useState<number>(initialWidth)
  const widthRef = useRef(initialWidth)
  const resizeRef = useRef(null)

  useEffect(() => {
    const newWidth = parseSafeInt(props.width, 0)
    if (newWidth !== widthRef.current) {
      setWidth(newWidth)
      widthRef.current = newWidth
    }
  }, [props.width])

  const minWidth = Math.min(parseSafeInt(props.minWidth, 100), parseSafeInt(props.maxWidth, 1000))
  const maxWidth = Math.max(parseSafeInt(props.minWidth, 100), parseSafeInt(props.maxWidth, 1000))

  const handleMouseDown = useCallback(
    (e: any) => {
      const startX = e.clientX
      const startWidth = widthRef.current

      const handleMouseMove = throttle((moveEvent: any) => {
        let newWidth = startWidth + (moveEvent.clientX - startX)
        newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth))

        if (newWidth !== widthRef.current) {
          widthRef.current = newWidth
          setWidth(newWidth)
        }
      }, 10)

      const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }

      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    },
    [minWidth, maxWidth],
  )

  props.mode = 'Resize'
  props.type = 'div'

  return Root({
    ...props,
    width,
    flex: 'unset',
    display: 'unset',
    flexDirection: 'unset',
    child: Stack({
      children: [
        Container({ child: props.child }),
        Positioned({
          top: 0,
          right: 0,
          width: 10,
          height: '100%',
          child: Container({
            color: 'transparent',
            cursor: 'ew-resize',
            padding: '0 2px',
            ref: resizeRef,
            onMouseDown: handleMouseDown,
          }),
        }),
      ],
    }),
  }).builder()
}

export interface PropsWidget {
  // ref?: React.RefObject<HTMLDivElement | null>;
  ref?: any
  key?: string | number
  format?: string
  className?: string
  id?: any
  builder?: Function
  onInputChange?: Function
  getOptionLabel?: Function
  renderInput?: Function
  onOpen?: Function
  onEnd?: Function
  onCreate?: Function
  handles?: any
  pointerEvents?: any
  text?: string
  label?: string
  title?: string
  placement?: string
  badgeContent?: number
  anchorReference?: string
  boxSizing?: string
  orientation?: string
  helperText?: string
  ask?: string
  easing?: string
  markdown?: string
  defaultLanguage?: string
  components?: any
  mode?: any
  dateAdapter?: any
  type?: any
  xmlns?: any
  d?: any
  fill?: any
  stroke?: any
  strokeWidth?: any
  inputType?: any
  attr?: any
  mui?: any
  sx?: any
  theme?: any
  rows?: number
  minRows?: number
  maxRows?: number
  minLength?: number
  maxLength?: number
  component?: any
  fullWidth?: any
  anchorPosition?: any
  anchorOrigin?: any
  startAdornment?: any
  startIcon?: any
  endAdornment?: any
  endIcon?: any
  value?: any
  defaultValue?: any
  anchorEl?: any
  message?: any
  action?: any
  InputProps?: any
  inputProps?: any
  autoHideDuration?: number
  open?: boolean
  indeterminate?: boolean
  multiline?: boolean
  required?: boolean
  enable?: boolean
  control?: any
  defaultChecked?: boolean
  disabled?: boolean
  checked?: boolean
  obscureText?: boolean
  error?: boolean
  length?: number
  click?: Function
  onContextMenu?: Function
  onBlur?: Function
  onAccept?: Function
  onChange?: Function
  onClick?: Function
  onClose?: Function
  onScroll?: Function
  onFocus?: Function
  onKeyDown?: Function
  onKeyUp?: Function
  onResize?: Function
  options?: any
  onMount?: any
  MenuProps?: any
  onMouseDown?: any
  onMouseMove?: any
  onMouseEnter?: any
  onMouseLeave?: any
  style?: any
  slotProps?: any
  onMouseUp?: any
  variant?: any
  child?: Widgets | React.ReactNode | Function
  tabs?: string[]
  contentTabs?: any[]
  direction?: string
  children?: any[]
  radius?: number
  gap?: number
  maxLine?: number
  placeholder?: string
  display?: string
  flex?: string | number
  flexDirection?: string
  flexWrap?: string
  flexShrink?: string
  justifyContent?: string
  justifySelf?: string
  alignItems?: string
  alignContent?: string
  alignSelf?: string
  resize?: boolean
  resizeRight?: boolean
  aspectRatio?: number
  duration?: number
  objectFit?:
    | 'cover'
    | 'contain'
    | 'fill'
    | 'none'
    | 'scale-down'
    | 'unset'
    | 'inherit'
    | 'initial'
    | 'revert'
    | 'revert-layer'
  width?: number | string
  height?: number | string
  minWidth?: number | string
  minHeight?: number | string
  maxWidth?: number | string
  maxHeight?: number | string
  margin?: number | string
  marginTop?: number | string
  marginRight?: number | string
  marginBottom?: number | string
  marginLeft?: number | string
  padding?: number | string
  paddingTop?: number | string
  paddingRight?: number | string
  paddingBottom?: number | string
  paddingLeft?: number | string
  border?: string
  opacity?: number
  borderSize?: number
  borderColor?: string
  borderRight?: string
  borderLeft?: string
  borderTop?: string
  borderBottom?: string
  borderRadius?: number | string
  outline?: string
  color?: string
  image?: string
  background?: string
  backgroundColor?: string
  backgroundImage?: string
  backgroundSize?: string
  backgroundPosition?: string
  backgroundRepeat?: string
  filter?: string
  backdropFilter?: string
  inset?: number | string | undefined
  size?: number | string
  fontSize?: number | string
  fontWeight?: string | number
  weight?: string | number
  fontColor?: string
  fontFamily?: string
  textAlign?: string
  lineHeight?: number | string
  letterSpacing?: number | string
  textDecoration?: string
  position?: any
  top?: number | string
  right?: number | string
  bottom?: number | string
  left?: number | string
  zIndex?: number
  boxShadow?: string
  textShadow?: string
  overflow?: string
  textOverflow?: string
  overflowX?: string
  overflowY?: string
  cursor?: string
  transition?: string
  animation?: string
  elevation?: number
  transform?: any
  whiteSpace?: string
  shadow?: boolean
  fullscreen?: boolean
  modal?: boolean
  userSelect?: string
  animateEffect?: string
  animateValue?: number
  src?: string
  iconName?: string
  textColor?: string
  center?: boolean
  confirm?: boolean
  loading?: boolean
  icon?: any
  borderTopLeftRadius?: number
  borderTopRightRadius?: number
  borderBottomLeftRadius?: number
  borderBottomRightRadius?: number
  borderRightColor?: string
  borderLeftColor?: string
  borderTopColor?: string
  borderBottomColor?: string
  to?: string
}

export function applyStyles(style: any, option: any) {
  // custome
  if (option.maxLine) {
    style.display = '-webkit-box'
    style.webkitBoxOrient = 'vertical'
    style.overflow = 'hidden'
    style.textOverflow = 'ellipsis'
    style.webkitLineClamp = option.maxLine
  }

  if (option.radius) {
    style.borderRadius = option.radius
  }

  if (option.shadow) {
    style.boxShadow = '0 1px 5px rgba(0, 0, 0, 0.12), 0 1px 5px rgba(0, 0, 0, 0.24)'
  }

  // Layout Properties
  if (option.display) style.display = option.display
  if (option.flex) style.flex = option.flex
  if (option.flexDirection) style.flexDirection = option.flexDirection
  if (option.justifyContent) style.justifyContent = option.justifyContent
  if (option.justifySelf) style.justifySelf = option.justifySelf
  if (option.alignItems) style.alignItems = option.alignItems
  if (option.alignContent) style.alignContent = option.alignContent
  if (option.alignSelf) style.alignSelf = option.alignSelf
  if (option.flexWrap) style.flexWrap = option.flexWrap
  if (option.flexShrink) style.flexShrink = option.flexShrink
  if (option.userSelect) style.userSelect = option.userSelect

  // Sizing Properties
  if (option.width != undefined) style.width = typeof option.width === 'number' ? `${option.width}px` : option.width
  if (option.height != undefined)
    style.height = typeof option.height === 'number' ? `${option.height}px` : option.height
  if (option.minWidth != undefined)
    style.minWidth = typeof option.minWidth === 'number' ? `${option.minWidth}px` : option.minWidth
  if (option.minHeight != undefined)
    style.minHeight = typeof option.minHeight === 'number' ? `${option.minHeight}px` : option.minHeight
  if (option.maxWidth != undefined)
    style.maxWidth = typeof option.maxWidth === 'number' ? `${option.maxWidth}px` : option.maxWidth
  if (option.maxHeight != undefined)
    style.maxHeight = typeof option.maxHeight === 'number' ? `${option.maxHeight}px` : option.maxHeight
  if (option.aspectRatio) style.aspectRatio = option.aspectRatio

  // Margin & Padding
  if (option.margin != undefined)
    style.margin = typeof option.margin === 'number' ? `${option.margin}px` : option.margin
  if (option.marginTop != undefined)
    style.marginTop = typeof option.marginTop === 'number' ? `${option.marginTop}px` : option.marginTop
  if (option.marginRight != undefined)
    style.marginRight = typeof option.marginRight === 'number' ? `${option.marginRight}px` : option.marginRight
  if (option.marginBottom != undefined)
    style.marginBottom = typeof option.marginBottom === 'number' ? `${option.marginBottom}px` : option.marginBottom
  if (option.marginLeft != undefined)
    style.marginLeft = typeof option.marginLeft === 'number' ? `${option.marginLeft}px` : option.marginLeft
  if (option.padding != undefined)
    style.padding = typeof option.padding === 'number' ? `${option.padding}px` : option.padding
  if (option.paddingTop != undefined)
    style.paddingTop = typeof option.paddingTop === 'number' ? `${option.paddingTop}px` : option.paddingTop
  if (option.paddingRight != undefined)
    style.paddingRight = typeof option.paddingRight === 'number' ? `${option.paddingRight}px` : option.paddingRight
  if (option.paddingBottom != undefined)
    style.paddingBottom = typeof option.paddingBottom === 'number' ? `${option.paddingBottom}px` : option.paddingBottom
  if (option.paddingLeft != undefined)
    style.paddingLeft = typeof option.paddingLeft === 'number' ? `${option.paddingLeft}px` : option.paddingLeft

  // Border & Outline
  if (option.borderSize != undefined) style.borderSize = option.borderSize
  if (option.borderSize != undefined) style.borderStyle = 'solid'
  if (option.borderColor != undefined) style.borderColor = option.borderColor
  if (option.border != undefined) style.border = option.border
  if (option.borderRight != undefined) style.borderRight = option.borderRight
  if (option.borderLeft != undefined) style.borderLeft = option.borderLeft
  if (option.borderTop != undefined) style.borderTop = option.borderTop
  if (option.borderBottom != undefined) style.borderBottom = option.borderBottom
  if (option.borderRadius != undefined)
    style.borderRadius = typeof option.borderRadius === 'number' ? `${option.borderRadius}px` : option.borderRadius
  if (option.outline != undefined) style.outline = option.outline
  if (option.borderRightColor != undefined) style.borderRightColor = option.borderRightColor
  if (option.borderLeftColor != undefined) style.borderLeftColor = option.borderLeftColor
  if (option.borderTopColor != undefined) style.borderTopColor = option.borderTopColor
  if (option.borderBottomColor != undefined) style.borderBottomColor = option.borderBottomColor

  // Background

  if (option.image) {
    option.backgroundImage = `url(${option.image})`
    option.backgroundSize = option.backgroundSize || 'cover'
    option.backgroundPosition = option.backgroundPosition || 'center'
    option.backgroundRepeat = option.backgroundRepeat || 'no-repeat'
  }

  // Background
  if (option.color) style.backgroundColor = option.color
  if (option.background) style.background = option.background
  if (option.backgroundColor) style.backgroundColor = option.backgroundColor
  if (option.backgroundImage) style.backgroundImage = option.backgroundImage
  if (option.backgroundSize) style.backgroundSize = option.backgroundSize
  if (option.backgroundPosition) style.backgroundPosition = option.backgroundPosition
  if (option.backgroundRepeat) style.backgroundRepeat = option.backgroundRepeat

  // Text & Font
  if (option.size != undefined)
    style.fontSize = typeof option.fontSize === 'number' ? `${option.fontSize}px` : option.fontSize
  if (option.fontSize != undefined)
    style.fontSize = typeof option.fontSize === 'number' ? `${option.fontSize}px` : option.fontSize
  if (option.fontWeight) style.fontWeight = option.fontWeight
  if (option.weight) style.fontWeight = option.weight
  if (option.fontColor) style.color = option.fontColor
  if (option.fontFamily) style.fontFamily = option.fontFamily
  if (option.textAlign) style.textAlign = option.textAlign
  if (option.lineHeight != undefined)
    style.lineHeight = typeof option.lineHeight === 'number' ? `${option.lineHeight}px` : option.lineHeight
  if (option.letterSpacing != undefined)
    style.letterSpacing = typeof option.letterSpacing === 'number' ? `${option.letterSpacing}px` : option.letterSpacing
  if (option.textDecoration) style.textDecoration = option.textDecoration

  // Positioning
  if (option.position) style.position = option.position
  if (option.top != undefined) style.top = typeof option.top === 'number' ? `${option.top}px` : option.top
  if (option.right != undefined) style.right = typeof option.right === 'number' ? `${option.right}px` : option.right
  if (option.bottom != undefined)
    style.bottom = typeof option.bottom === 'number' ? `${option.bottom}px` : option.bottom
  if (option.left != undefined) style.left = typeof option.left === 'number' ? `${option.left}px` : option.left
  if (option.zIndex != undefined) style.zIndex = option.zIndex

  // Shadow
  if (option.boxShadow) style.boxShadow = option.boxShadow
  if (option.textShadow) style.textShadow = option.textShadow

  // opacity
  if (option.opacity != undefined) style.opacity = parseInt(option.opacity)

  // Overflow
  if (option.overflow) style.overflow = option.overflow
  if (option.overflowX) style.overflowX = option.overflowX
  if (option.overflowY) style.overflowY = option.overflowY
  if (option.textOverflow) style.textOverflow = option.textOverflow

  // Cursor
  if (option.cursor) style.cursor = option.cursor

  // Transition & Animation
  if (option.transition) style.transition = option.transition
  if (option.animation) style.animation = option.animation
  if (option.transform) style.transform = option.transform

  if (option.whiteSpace) style.whiteSpace = option.whiteSpace

  // add radius
  if (option.borderTopLeftRadius) style.borderTopLeftRadius = option.borderTopLeftRadius
  if (option.borderTopRightRadius) style.borderTopRightRadius = option.borderTopRightRadius
  if (option.borderBottomLeftRadius) style.borderBottomLeftRadius = option.borderBottomLeftRadius
  if (option.borderBottomRightRadius) style.borderBottomRightRadius = option.borderBottomRightRadius

  if (option.boxSizing) style.boxSizing = option.boxSizing
  if (option.gap) style.gap = option.gap

  // Image
  if (option.objectFit) style.objectFit = option.objectFit
  if (option.inset) style.inset = option.inset
  if (option.pointerEvents) style.pointerEvents = option.pointerEvents

  // Filter
  if (option.filter) style.filter = option.filter
  if (option.backdropFilter) style.backdropFilter = option.backdropFilter

  return style
}

function getDefaultConfig(props: PropsWidget) {
  const defaultConfig: any = {
    top: props.top || 0,
    left: props.left || 0,
    color: props.color || 'transparent',
    width: props.width || '50%',
    height: props.height || '80%',
    child: props.child,
  }

  const normalizeSize = (value: string | number): string => {
    const stringValue = value.toString().trim()
    return /\d(px|%)$/.test(stringValue) ? stringValue : `${stringValue}px`
  }

  defaultConfig.width = normalizeSize(defaultConfig.width)
  defaultConfig.height = normalizeSize(defaultConfig.height)

  if (props.fullscreen) {
    defaultConfig.top = 0
    defaultConfig.left = 0
    defaultConfig.width = '100%'
    defaultConfig.height = '100%'
  }

  defaultConfig.top = `calc((100% - ${defaultConfig.height}) / 2)`
  defaultConfig.left = `calc((100% - ${defaultConfig.width}) / 2)`
  defaultConfig.transform = `translate(-${defaultConfig.top}, -${defaultConfig.left})`

  return defaultConfig
}

export default function buildingStore<
  T,
  R extends SliceCaseReducers<T>,
  C extends Record<string, (...args: any[]) => any>,
>(
  name: string,
  initialState: T,
  reducers: R,
  init?: (dispatch: any) => void,
  computedState?: (getState: () => T) => C,
) {
  const slice = createSlice({
    name,
    initialState,
    reducers: reducers as ValidateSliceCaseReducers<T, R>,
  })

  const stored = configureStore({ reducer: { [name]: slice.reducer } })
  type ActionsType = typeof slice.actions

  return function useStore(): { state: T } & ActionsType & C {
    const [state, setState] = useState<T>(stored.getState()[name])

    useEffect(() => {
      const unsubscribe = stored.subscribe(() => {
        setState(stored.getState()[name])
      })

      if (init) {
        init((data: any) => {
          stored.dispatch({ type: `${name}/init`, payload: data })
        })
      }

      return () => unsubscribe()
    }, [])

    const parseFn: Record<string, (data: any) => void> = {}
    for (const key in slice.actions) {
      const actionCreator = slice.actions[key]
      if (typeof actionCreator === 'function') {
        parseFn[key] = (...args: any) => {
          stored.dispatch(actionCreator(...args))
        }
      }
    }

    const computed = computedState ? computedState(() => stored.getState()[name]) : ({} as C)

    return {
      state,
      ...(parseFn as ActionsType),
      ...computed,
    }
  }
}

export class MediaQuery {
  static width() {
    return window.innerWidth
  }

  static height() {
    return window.innerHeight
  }

  static isMobile() {
    return window.innerWidth < 768
  }

  static isTablet() {
    return window.innerWidth >= 768 && window.innerWidth < 1024
  }

  static isDesktop() {
    return window.innerWidth >= 1024
  }
}

export class DataDefinition {
  private commands: string[] = []

  moveTo(x: number, y: number): this {
    this.commands.push(`M${x},${y}`)
    return this
  }

  lineTo(x: number, y: number): this {
    this.commands.push(`L${x},${y}`)
    return this
  }

  horizontal(x: number): this {
    this.commands.push(`H${x}`)
    return this
  }

  quadTo(cx: number, cy: number, x: number, y: number): this {
    this.commands.push(`Q${cx},${cy} ${x},${y}`)
    return this
  }

  vertical(y: number): this {
    this.commands.push(`V${y}`)
    return this
  }

  arcTo(
    rx: number,
    ry: number,
    xAxisRotation: number = 0,
    largeArcFlag: number = 0,
    sweepFlag: number = 1,
    x: number,
    y: number,
  ): this {
    this.commands.push(`A${rx},${ry} ${xAxisRotation} ${largeArcFlag} ${sweepFlag} ${x},${y}`)
    return this
  }

  close(): string {
    this.commands.push('Z')
    return this.toString()
  }

  toString(): string {
    return this.commands.join(' ')
  }

  get value(): string {
    return this.toString()
  }
}
