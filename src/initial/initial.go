package initial

import (
	"context"
	"go_file_sync/src/global"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type Initial struct {
	ctx *context.Context
}

func NewInitial(ctx *context.Context) *Initial {
	return &Initial{
		ctx: ctx,
	}
}

// Initial Sync Directory List Page...
func (i *Initial) InitialSnycDirectoryListPage() {
	runtime.WindowSetTitle(*i.ctx, "go_file_sync - Directory List Page")
	runtime.WindowSetMinSize(*i.ctx, 800, 600)
	runtime.WindowSetSize(*i.ctx, 1024, 768)
	// runtime.WindowCenter(*i.ctx)
}

// Initial InputPortPage Setting...
func (i *Initial) InitialInputPortPage() {
	runtime.WindowSetTitle(*i.ctx, "go_file_sync - Start Server")
	runtime.WindowSetMinSize(*i.ctx, 500, 500)
	runtime.WindowSetSize(*i.ctx, 500, 500)
	runtime.WindowCenter(*i.ctx)
}

// Initial ConnectServerPage Setting...
func (i *Initial) InitialConnectServerPage(port string) {
	runtime.WindowSetTitle(*i.ctx, "go_file_sync - Connect Server - "+global.GetOutboundIP().String()+":"+port)
	runtime.WindowSetMinSize(*i.ctx, 500, 500)
	runtime.WindowSetSize(*i.ctx, 500, 500)
}
