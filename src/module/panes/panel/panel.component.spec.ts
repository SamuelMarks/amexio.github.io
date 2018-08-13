import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { IconLoaderService } from '../../../index';
import { AmexioPanelComponent } from './panel.component';
import { AmexioIconPaneComponent} from '../icon/icon.component';
import { toUnicode } from 'punycode';
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from 'constants';

describe('amexio-steps', () => {
    let comp: AmexioPanelComponent;
    let fixture: ComponentFixture<AmexioPanelComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [AmexioPanelComponent,AmexioIconPaneComponent],
            providers: [IconLoaderService],
        });
        fixture = TestBed.createComponent(AmexioPanelComponent);
        comp = fixture.componentInstance;
    });

    it('',() => {

        (<any>comp).faFaIconUPCss = 'fa fa-caret-up';
        (<any>comp).faFaIconDownCss = 'fa fa-caret-down';

        expect( (<any>comp).faFaIconUPCss).toEqual('fa fa-caret-up');
        expect( (<any>comp).faFaIconDownCss).toEqual('fa fa-caret-down');
        
    })
});
    
